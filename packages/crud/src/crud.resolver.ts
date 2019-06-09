import { capitalizeFirstLetter, ExceptionHandler, unCapitalizeFirstLetter } from '@magishift/util';
import { ClassSerializerInterceptor, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphQLJSONObject } from 'graphql-type-json';
import pluralize = require('pluralize');
import { ArgsType, ClassType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';
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
): new (service: ICrudService<TEntity, TDto>, mapper: ICrudMapper<TEntity, TDto>, pubSub: PubSub) => ICrudResolver<
  TDto
> {
  const nameCapFirst = capitalizeFirstLetter(name);
  const nameUnCapFirst = unCapitalizeFirstLetter(name);

  // graphql query name template
  const findById: string = `${nameUnCapFirst}ById`;
  const findAll: string = `all${pluralize(nameCapFirst)}`;
  const create: string = `create${nameCapFirst}`;
  const update: string = `update${nameCapFirst}`;
  const destroy: string = `delete${nameCapFirst}`;
  const destroyById: string = `delete${nameCapFirst}ById`;

  // graphql subscription name templates
  const subCreated: string = `${nameUnCapFirst}Created`;
  const subUpdated: string = `${nameUnCapFirst}Updated`;
  const subDestroyed: string = `${nameUnCapFirst}Deleted`;

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
    @Field(() => GraphQLJSONObject, { nullable: true })
    where?: Partial<TDto>;

    @Field(() => GraphQLJSONObject, { nullable: true })
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
  class CrudResolver implements ICrudResolver<TDto> {
    constructor(
      protected readonly service: ICrudService<TEntity, TDto>,
      protected readonly mapper: ICrudMapper<TEntity, TDto>,
      protected readonly pubSub: PubSub,
    ) {}

    @Query(() => dtoClass, { name: findById })
    async findById(@Args('id') id: string): Promise<TDto> {
      try {
        return await this.service.fetch(id);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Query(() => FindAllResult, { name: findAll })
    async findAll(@Args() filter: FilterResolver): Promise<FindAllResult> {
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
