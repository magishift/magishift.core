import { HttpException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query } from '@nestjs/graphql';
import * as pluralize from 'pluralize';
import { IEndpointRoles } from '../auth/role/role.interface';
import { Roles } from '../auth/role/roles.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { GraphQLInstance } from '../graphql/graphql.instance';
import { ExceptionHandler } from '../utils/error.utils';
import { capitalizeFirstLetter } from '../utils/string.utils';
import { ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudResolver } from './interfaces/crudResolver.interface';
import { ICrudService } from './interfaces/crudService.interface';

export function ResolverFactory<TDto extends ICrudDto, TEntity extends ICrudEntity>(
  name: string,
  roles: IEndpointRoles,
): new (service: ICrudService<TEntity, TDto>, mapper: ICrudMapper<TEntity, TDto>) => ICrudResolver<TDto, TEntity> {
  const nameCapFirst = capitalizeFirstLetter(name);

  // graphql query name template
  const findById: string = `${name}ById`;
  const findAll: string = `all${pluralize(nameCapFirst)}`;
  const create: string = `create${nameCapFirst}`;
  const update: string = `update${nameCapFirst}`;
  const updateById: string = `update${nameCapFirst}ById`;
  const destroy: string = `delete${nameCapFirst}`;
  const destroyById: string = `delete${nameCapFirst}ById`;

  @UseGuards(RolesGuard)
  class CrudResolverBuilder implements ICrudResolver<TDto, TEntity> {
    constructor(
      protected readonly service: ICrudService<TEntity, TDto>,
      protected readonly mapper: ICrudMapper<TEntity, TDto>,
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

        const entity = await this.mapper.dtoToEntity(dto);

        const findOne = await this.service.findOne(entity);

        const result = await this.service.destroy(findOne.id);

        if (result) {
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
          return { [name]: entity };
        } else {
          throw new HttpException(`Cannot delete ${name} with id ${dto.id}`, 400);
        }
      } catch (e) {
        return ExceptionHandler(e);
      }
    }
  }

  return CrudResolverBuilder;
}
