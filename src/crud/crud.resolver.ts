import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import * as pluralize from 'pluralize';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/role/roles.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { GraphQLInstance } from '../graphql/graphql.instance';
import { IEndpointUserRoles } from '../user/userRole/interfaces/userRoleEndpoint.interface';
import { ExceptionHandler } from '../utils/error.utils';
import { capitalizeFirstLetter } from '../utils/string.utils';
import { ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudResolver, ISubscriptionResult } from './interfaces/crudResolver.interface';
import { ICrudService } from './interfaces/crudService.interface';
import { PubSubList } from './providers/pubSub.provider';

export function ResolverFactory<TDto extends ICrudDto, TEntity extends ICrudEntity>(
  name: string,
  roles: IEndpointUserRoles,
): new (service: ICrudService<TEntity, TDto>, mapper: ICrudMapper<TEntity, TDto>, pubSub: PubSub) => ICrudResolver<
  TDto,
  TEntity
> {
  const nameCapFirst = capitalizeFirstLetter(name);

  // graphql query name template
  const findById: string = `${name}ById`;
  const findAll: string = `all${pluralize(nameCapFirst)}`;
  const create: string = `create${nameCapFirst}`;
  const update: string = `update${nameCapFirst}`;
  const updateById: string = `update${nameCapFirst}ById`;
  const destroy: string = `delete${nameCapFirst}`;
  const destroyById: string = `delete${nameCapFirst}ById`;

  // graphql subscription name templates
  const subCreated: string = `${name}Created`;
  const subUpdated: string = `${name}Updated`;
  const subDestroyed: string = `${name}Deleted`;

  PubSubList.RegisterPubsub(subCreated, nameCapFirst);
  PubSubList.RegisterPubsub(subUpdated, nameCapFirst);
  PubSubList.RegisterPubsub(subDestroyed, nameCapFirst);

  @UseGuards(RolesGuard)
  class CrudResolverBuilder implements ICrudResolver<TDto, TEntity> {
    constructor(
      protected readonly service: ICrudService<TEntity, TDto>,
      protected readonly mapper: ICrudMapper<TEntity, TDto>,
      protected readonly pubSub: PubSub,
    ) {}

    @Query(findById)
    @Roles(...(roles.read || roles.default))
    async findById(@Context() ctx: any): Promise<object> {
      try {
        const result = await GraphQLInstance.performQuery(ctx.bodyScope);
        return result[findById];
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Query(findAll)
    @Roles(...(roles.read || roles.default))
    async findAll(@Context() ctx: any): Promise<object> {
      try {
        const result = await GraphQLInstance.performQuery(ctx.bodyScope);

        return result[findAll];
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(create)
    @Roles(...(roles.write || roles.default))
    async create(@Args() args: { input }): Promise<void> {
      try {
        const dto = await this.mapper.dtoFromObject(args.input[name]);
        await dto.validate();

        const result = await this.service.create(dto);

        const subPayload = {};
        subPayload[subCreated] = result;
        this.pubSub.publish(subCreated, subPayload);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(updateById)
    @Roles(...(roles.update || roles.write || roles.default))
    async updateById(@Args() args: { input }): Promise<void> {
      try {
        const dto = await this.mapper.dtoFromObject(args.input[`${name}Patch`]);
        await dto.validate();

        const result = await this.service.update(args.input.id, dto);

        const subPayload = {};
        subPayload[subUpdated] = result;
        this.pubSub.publish(subUpdated, subPayload);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(update)
    @Roles(...(roles.update || roles.write || roles.default))
    async update(@Args() args: { input }): Promise<void> {
      try {
        const dto = await this.mapper.dtoFromObject(args.input[`${name}Patch`]);
        await dto.validate();

        const result = await this.service.update(dto.id, dto);

        const subPayload = {};
        subPayload[subUpdated] = result;
        this.pubSub.publish(subUpdated, subPayload);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(destroy)
    @Roles(...(roles.delete || roles.default))
    async destroy(@Args() args: { input }): Promise<void> {
      try {
        const dto: TEntity = (await this.mapper.dtoToEntity(await this.mapper.dtoFromObject(args.input))) as TEntity;

        const entity = await this.service.findOne(dto);

        await this.service.destroy(entity.id);

        const subPayload = {};
        subPayload[subDestroyed] = entity;
        this.pubSub.publish(subDestroyed, subPayload);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(destroyById)
    @Roles(...(roles.delete || roles.default))
    async destroyById(@Args() args: { input }): Promise<object> {
      try {
        const dto = await this.mapper.dtoFromObject(args.input);

        const entity = await this.service.fetch(dto.id);

        await this.service.destroy(entity.id);

        const subPayload = {};
        subPayload[subDestroyed] = entity;
        this.pubSub.publish(subDestroyed, subPayload);

        return { [name]: entity };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Subscription(subCreated)
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

            return ExceptionHandler(`You don't have have permission to subscribe`, HttpStatus.FORBIDDEN);
          } catch (e) {
            return ExceptionHandler(e);
          }
        },
      };
    }

    @Subscription(subUpdated)
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

            return ExceptionHandler(`You don't have have permission to subscribe`, HttpStatus.FORBIDDEN);
          } catch (e) {
            return ExceptionHandler(e);
          }
        },
      };
    }

    @Subscription(subDestroyed)
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

            return ExceptionHandler(`You don't have have permission to subscribe`, HttpStatus.FORBIDDEN);
          } catch (e) {
            return ExceptionHandler(e);
          }
        },
      };
    }
  }

  return CrudResolverBuilder;
}
