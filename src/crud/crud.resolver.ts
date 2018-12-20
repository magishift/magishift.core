import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query } from '@nestjs/graphql';
import * as pluralize from 'pluralize';
import { IEndpointRoles } from '../auth/role/role.interface';
import { Roles } from '../auth/role/roles.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { HttpService } from '../http/http.service';
import { ExceptionHandler } from '../utils/error.utils';
import { capitalizeFirstLetter } from '../utils/string.utils';
import { ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudResolver } from './interfaces/crudResolver.interface';
import { ICrudService } from './interfaces/crudService.interface';

export abstract class CrudResolver<TDto extends ICrudDto, TEntity extends ICrudEntity> implements ICrudResolver {
  constructor(
    protected readonly service: ICrudService<TEntity, TDto>,
    protected readonly mapper: ICrudMapper<TEntity, TDto>,
    protected readonly http: HttpService,
  ) {}

  async findById(@Context() ctx: any): Promise<object> {
    throw this.forceFactory();
  }

  async findAll(@Context() ctx: any): Promise<object> {
    throw this.forceFactory();
  }

  async create(@Args() args: { input }): Promise<object> {
    throw this.forceFactory();
  }

  async updateById(@Context() _ctx: any, @Args() args: { input }): Promise<object> {
    throw this.forceFactory();
  }

  async update(@Context() ctx: any, @Args() args: { input }): Promise<object> {
    throw this.forceFactory();
  }

  async destroy(@Context() ctx: any): Promise<object> {
    throw this.forceFactory();
  }

  async destroyById(@Context() ctx: any): Promise<object> {
    throw this.forceFactory();
  }

  private forceFactory(): Error {
    return new Error('Please use ResolverFactory or extends and override this method');
  }
}

export function ResolverFactory<TDto extends ICrudDto, TEntity extends ICrudEntity>(
  name: string,
  roles: IEndpointRoles,
): {
  new (service: ICrudService<TEntity, TDto>, mapper: ICrudMapper<TEntity, TDto>, http: HttpService): CrudResolver<
    TDto,
    TEntity
  >;
} {
  const nameCapFirst = capitalizeFirstLetter(name);

  const findById: string = `${name}ById`;
  const findAll: string = `all${pluralize(nameCapFirst)}`;
  const create: string = `create${nameCapFirst}`;
  const update: string = `update${nameCapFirst}`;
  const updateById: string = `update${nameCapFirst}ById`;
  const destroy: string = `delete${nameCapFirst}`;
  const destroyById: string = `delete${nameCapFirst}ById`;

  @UseGuards(RolesGuard)
  class CrudResolverBuilder extends CrudResolver<TDto, TEntity> {
    constructor(
      protected readonly service: ICrudService<TEntity, TDto>,
      protected readonly mapper: ICrudMapper<TEntity, TDto>,
      protected readonly http: HttpService,
    ) {
      super(service, mapper, http);
    }

    @Query(findById)
    @Roles(...(roles.read || roles.default))
    async findById(@Context() ctx: any): Promise<object> {
      try {
        const result = await this.http.ExecGql(ctx.bodyScope);
        return result[findById];
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Query(findAll)
    @Roles(...(roles.read || roles.default))
    async findAll(@Context() ctx: any): Promise<object> {
      try {
        const result = await this.http.ExecGql(ctx.bodyScope);

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
        return { [name]: result };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(updateById)
    @Roles(...(roles.update || roles.write || roles.default))
    async updateById(@Context() _ctx: any, @Args() args: { input }): Promise<object> {
      try {
        const dto = await this.mapper.dtoFromObject(args.input[`${name}Patch`]);
        await dto.validate();

        const result = await this.service.update(args.input.id, dto);

        return { [name]: result };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(update)
    @Roles(...(roles.update || roles.write || roles.default))
    async update(@Context() ctx: any, @Args() args: { input }): Promise<object> {
      try {
        const dto = await this.mapper.dtoFromObject(args.input[`${name}Patch`]);
        await dto.validate();

        const result = await this.service.update(dto.id, dto);

        return { [name]: result };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(destroy)
    @Roles(...(roles.delete || roles.default))
    async destroy(@Context() ctx: any): Promise<object> {
      try {
        const result = await this.http.ExecGql(ctx.bodyScope);
        return result[destroy];
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Mutation(destroyById)
    @Roles(...(roles.delete || roles.default))
    async destroyById(@Context() ctx: any): Promise<object> {
      try {
        const result = await this.http.ExecGql(ctx.bodyScope);
        return result[destroy];
      } catch (e) {
        return ExceptionHandler(e);
      }
    }
  }

  return CrudResolverBuilder;
}
