import { HttpException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import * as pluralize from 'pluralize';
import { AuthService } from '../auth/auth.service';
import { IEndpointRoles } from '../auth/role/role.interface';
import { Roles } from '../auth/role/roles.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { GraphQLInstance } from '../graphql/graphql.instance';
import { HttpService } from '../http/http.service';
import { ExceptionHandler } from '../utils/error.utils';
import { capitalizeFirstLetter } from '../utils/string.utils';
import { ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudResolver, ISubscriptionResult } from './interfaces/crudResolver.interface';
import { ICrudService } from './interfaces/crudService.interface';
import { PubSubList } from './providers/pubSub.provider';

export function ResolverFactory<TDto extends ICrudDto, TEntity extends ICrudEntity>(
  name: string,
  roles: IEndpointRoles,
): new (
  service: ICrudService<TEntity, TDto>,
  authService: AuthService,
  mapper: ICrudMapper<TEntity, TDto>,
  pubSub: PubSub,
  http: HttpService,
) => ICrudResolver<TDto, TEntity> {
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
      protected readonly authService: AuthService,
      protected readonly mapper: ICrudMapper<TEntity, TDto>,
      protected readonly pubSub: PubSub,
      protected readonly http: HttpService,
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
    async create(@Args() args: { input }): Promise<object> {
      try {
        const dto = await this.mapper.dtoFromObject(args.input[name]);
        await dto.validate();

        const result = await this.service.create(dto);

        const subPayload = {};
        subPayload[subCreated] = result;
        this.pubSub.publish(subCreated, subPayload);

        return { [name]: result };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(updateById)
    @Roles(...(roles.update || roles.write || roles.default))
    async updateById(@Args() args: { input }): Promise<object> {
      try {
        const dto = await this.mapper.dtoFromObject(args.input[`${name}Patch`]);
        await dto.validate();

        const result = await this.service.update(args.input.id, dto);

        const subPayload = {};
        subPayload[subUpdated] = result;
        this.pubSub.publish(subUpdated, subPayload);

        return { [name]: result };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(update)
    @Roles(...(roles.update || roles.write || roles.default))
    async update(@Args() args: { input }): Promise<object> {
      try {
        const dto = await this.mapper.dtoFromObject(args.input[`${name}Patch`]);
        await dto.validate();

        const result = await this.service.update(dto.id, dto);

        const subPayload = {};
        subPayload[subUpdated] = result;
        this.pubSub.publish(subUpdated, subPayload);

        return { [name]: result };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(destroy)
    @Roles(...(roles.delete || roles.default))
    async destroy(@Args() args: { input }): Promise<object> {
      try {
        const dto = await this.mapper.dtoFromObject(args.input);

        const entity = await this.service.findOne(await this.mapper.dtoToEntity(dto));

        const result = await this.service.destroy(entity.id);

        if (result) {
          const subPayload = {};
          subPayload[subDestroyed] = entity;
          this.pubSub.publish(subDestroyed, subPayload);

          return { [name]: entity };
        } else {
          throw new HttpException(`Cannot delete ${name} with id ${dto.id}`, 400);
        }
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

        const result = await this.service.destroy(entity.id);

        if (result) {
          const subPayload = {};
          subPayload[subDestroyed] = entity;
          this.pubSub.publish(subDestroyed, subPayload);

          return { [name]: entity };
        } else {
          throw new HttpException(`Cannot delete ${name} with id ${dto.id}`, 400);
        }
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
            const canAccess = await this.authService.authorizeToken(token, subCreated, roles.write || roles.default);

            if (canAccess) {
              return this.pubSub.asyncIterator(subCreated);
            }

            throw new HttpException(`You don't have have permission to subscribe`, 403);
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
            const canAccess = await this.authService.authorizeToken(
              token,
              subUpdated,
              roles.update || roles.write || roles.default,
            );

            if (canAccess) {
              return this.pubSub.asyncIterator(subUpdated);
            }

            throw new HttpException(`You don't have have permission to subscribe`, 403);
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
            const canAccess = await this.authService.authorizeToken(token, subDestroyed, roles.delete || roles.default);

            if (canAccess) {
              return this.pubSub.asyncIterator(subDestroyed);
            }

            throw new HttpException(`You don't have have permission to subscribe`, 403);
          } catch (e) {
            return ExceptionHandler(e);
          }
        },
      };
    }
  }

  return CrudResolverBuilder;
}
