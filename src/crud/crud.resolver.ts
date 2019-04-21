import { ClassSerializerInterceptor, HttpException, HttpStatus, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import pluralize = require('pluralize');
import { ArgsType, ClassType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { AuthService } from '../auth/auth.service';
import { Realms } from '../auth/role/realms.decorator';
import { Roles } from '../auth/role/roles.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { IEndpointUserRoles } from '../user/userRole/interfaces/userRoleEndpoint.interface';
import { ExceptionHandler } from '../utils/error.utils';
import { capitalizeFirstLetter } from '../utils/string.utils';
import { CrudDto } from './crud.dto';
import { Filter } from './crud.filter';
import { ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudResolver, ISubscriptionResult } from './interfaces/crudResolver.interface';
import { ICrudService } from './interfaces/crudService.interface';
import { IFindAllResult } from './interfaces/filter.interface';
import { PubSubList } from './providers/pubSub.provider';

export function CrudResolverFactory<TDto extends ICrudDto, TEntity extends ICrudEntity>(
  name: string,
  dtoClass: ClassType<CrudDto>,
  roles: IEndpointUserRoles,
  realms?: string[],
): new (service: ICrudService<TEntity, TDto>, mapper: ICrudMapper<TEntity, TDto>, pubSub: PubSub) => ICrudResolver<
  TDto
> {
  const nameCapFirst = capitalizeFirstLetter(name);

  // graphql query name template
  const findById: string = `${name}ById`;
  const findAll: string = `all${pluralize(nameCapFirst)}`;
  const create: string = `create${nameCapFirst}`;
  const update: string = `update${nameCapFirst}`;
  const destroy: string = `delete${nameCapFirst}`;
  const destroyById: string = `delete${nameCapFirst}ById`;

  // graphql subscription name templates
  const subCreated: string = `${name}Created`;
  const subUpdated: string = `${name}Updated`;
  const subDestroyed: string = `${name}Deleted`;

  PubSubList.RegisterPubsub(subCreated, nameCapFirst);
  PubSubList.RegisterPubsub(subUpdated, nameCapFirst);
  PubSubList.RegisterPubsub(subDestroyed, nameCapFirst);

  @InputType(`${nameCapFirst}Create`)
  class InputCreate extends dtoClass {
    @Field(() => ID, { nullable: true })
    id: string;
  }

  @InputType(`${nameCapFirst}Update`)
  class InputUpdate extends dtoClass {
    @Field(() => ID, { nullable: false })
    id: string;
  }

  @InputType(`${nameCapFirst}Delete`)
  class InputDelete extends dtoClass {
    @Field(() => ID, { nullable: false })
    id: string;
  }

  @ArgsType()
  class FilterResolver extends Filter<TDto> {
    @Field(() => dtoClass, { nullable: true })
    where?: Partial<TDto>;

    @Field(() => dtoClass, { nullable: true })
    whereOr?: Partial<TDto>;
  }

  @ObjectType(`${nameCapFirst}FindAll`)
  class FindAllResult implements IFindAllResult {
    @Field(() => Int)
    totalCount: number;

    @Field(() => [dtoClass])
    items: TDto[];
  }

  @Resolver(() => dtoClass, { isAbstract: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @Roles(...roles.default)
  @Realms(...(realms || []))
  class CrudResolver implements ICrudResolver<TDto> {
    constructor(
      protected readonly service: ICrudService<TEntity, TDto>,
      protected readonly mapper: ICrudMapper<TEntity, TDto>,
      protected readonly pubSub: PubSub,
    ) {}

    @Query(() => dtoClass, { name: findById })
    @Roles(...(roles.read || roles.default))
    async findById(@Args('id') id: string): Promise<TDto> {
      try {
        return await this.service.fetch(id);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Query(() => FindAllResult, { name: findAll })
    @Roles(...(roles.read || roles.default))
    async findAll(@Args() filter: FilterResolver): Promise<IFindAllResult> {
      try {
        const items = await this.service.findAll(filter);
        const totalCount = await this.service.count(filter);

        return {
          items,
          totalCount,
        };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(() => Boolean, { name: create })
    @Roles(...(roles.write || roles.default))
    async create(@Args('data') args: InputCreate): Promise<void> {
      try {
        const data = await this.mapper.dtoFromObject(args as any);
        await data.validate();

        const result = await this.service.create(data);

        const subPayload = {};
        subPayload[subCreated] = result;
        this.pubSub.publish(subCreated, subPayload);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(() => Boolean, { name: update })
    @Roles(...(roles.update || roles.write || roles.default))
    async update(@Args('data') args: InputUpdate): Promise<void> {
      try {
        const data = await this.mapper.dtoFromObject(args as TDto);

        await data.validate();

        const result = await this.service.update(data.id, data);

        const subPayload = {};
        subPayload[subUpdated] = result;
        this.pubSub.publish(subUpdated, subPayload);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(() => Boolean, { name: destroy })
    @Roles(...(roles.delete || roles.default))
    async destroy(@Args('data') args: InputDelete): Promise<void> {
      try {
        const data: TEntity = (await this.mapper.dtoToEntity(await this.mapper.dtoFromObject(args as TDto))) as TEntity;

        const entity = await this.service.findOne(data);

        await this.service.destroy(entity.id);

        const subPayload = {};
        subPayload[subDestroyed] = entity;
        this.pubSub.publish(subDestroyed, subPayload);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(() => Boolean, { name: destroyById })
    @Roles(...(roles.delete || roles.default))
    async destroyById(@Args('id') id: string): Promise<void> {
      try {
        const entity = await this.service.fetch(id);

        await this.service.destroy(entity.id);

        const subPayload = {};
        subPayload[subDestroyed] = entity;
        this.pubSub.publish(subDestroyed, subPayload);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Subscription(() => dtoClass, { name: subCreated })
    created(): ISubscriptionResult {
      return {
        subscribe: async (...args: any[]) => {
          try {
            const ws = args[2];
            const token = ws.connection.context.authorization;
            const realm = ws.connection.context.realm || ws.connection.context['x-realm'];

            const canAccess = await AuthService.authorizeToken(token, subCreated, realm, roles.write || roles.default);

            if (canAccess) {
              return this.pubSub.asyncIterator(subCreated);
            }

            throw new HttpException(`You don't have have permission to subscribe`, HttpStatus.FORBIDDEN);
          } catch (e) {
            return ExceptionHandler(e);
          }
        },
      };
    }

    @Subscription(() => dtoClass, { name: subUpdated })
    updated(): ISubscriptionResult {
      return {
        subscribe: async (...args: any[]) => {
          try {
            const ws = args[2];
            const token = ws.connection.context.authorization;
            const realm = ws.connection.context.realm || ws.connection.context['x-realm'];

            const canAccess = await AuthService.authorizeToken(
              token,
              subUpdated,
              realm,
              roles.update || roles.write || roles.default,
            );

            if (canAccess) {
              return this.pubSub.asyncIterator(subUpdated);
            }

            throw new HttpException(`You don't have have permission to subscribe`, HttpStatus.FORBIDDEN);
          } catch (e) {
            return ExceptionHandler(e);
          }
        },
      };
    }

    @Subscription(() => dtoClass, { name: subDestroyed })
    destroyed(): ISubscriptionResult {
      return {
        subscribe: async (...args: any[]) => {
          try {
            const ws = args[2];
            const token = ws.connection.context.authorization;
            const realm = ws.connection.context.realm || ws.connection.context['x-realm'];

            const canAccess = await AuthService.authorizeToken(
              token,
              subDestroyed,
              realm,
              roles.delete || roles.default,
            );

            if (canAccess) {
              return this.pubSub.asyncIterator(subDestroyed);
            }

            throw new HttpException(`You don't have have permission to subscribe`, HttpStatus.FORBIDDEN);
          } catch (e) {
            return ExceptionHandler(e);
          }
        },
      };
    }
  }

  return CrudResolver;
}
