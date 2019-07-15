import { BaseService, DataStatus } from '@magishift/base';
import { ColumnIsNumber, GetPropertyType, GetRelationsTableName } from '@magishift/util';
import { HttpException } from '@nestjs/common';
import _ = require('lodash');
import { FindConditions, FindManyOptions, FindOneOptions, Like, ObjectLiteral, Repository } from 'typeorm';
import { GetFormSchema, GetGridSchema, GetKanbanSchema } from './crud.util';
import { ICrudConfig, ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudService, IServiceConfig } from './interfaces/crudService.interface';
import { IFilter } from './interfaces/filter.interface';
import { IFormSchema } from './interfaces/form.interface';
import { IGridSchema } from './interfaces/grid.interface';
import { IKanban } from './interfaces/kanban.interface';

export abstract class CrudService<TEntity extends ICrudEntity, TDto extends ICrudDto> extends BaseService<TEntity>
  implements ICrudService<TEntity, TDto> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly mapper: ICrudMapper<TEntity, TDto>,
    protected readonly config: IServiceConfig = { softDelete: true },
  ) {
    super(repository);
  }

  getCrudConfig(): ICrudConfig {
    return {
      kanban: this.getKanbanSchema(),
      grid: this.getGridSchema(),
      form: this.getFormSchema(),
      softDelete: this.config.softDelete,
    };
  }

  getFormSchema(): IFormSchema {
    const result = GetFormSchema(this.constructor.name);

    return result;
  }

  getGridSchema(): IGridSchema {
    const result = GetGridSchema(this.constructor.name);

    const relations = GetRelationsTableName(this.repository.metadata);

    if (relations && relations.length > 0) {
      result.schema.foreignKey = {};

      relations.map(relation => {
        result.schema.foreignKey[relation] = relation;
      });
    }

    if (result && _.isEmpty(result.schema)) {
      return null;
    }

    return result;
  }

  getKanbanSchema(): IKanban {
    const result = GetKanbanSchema(this.constructor.name);

    return result;
  }

  async isExist(id: string): Promise<boolean> {
    return !!(await this.repository.findOne(id));
  }

  async count(
    filter: IFilter = {
      offset: 0,
      limit: -1,
      isShowDeleted: false,
    },
  ): Promise<number> {
    const findOptions = this.resolveFindOptions(filter);

    const result = await this.repository.count(findOptions);

    return result;
  }

  async fetch(id: string, options?: FindOneOptions<TEntity>): Promise<TDto> {
    options = options || {};
    options.cache = true;

    options.relations = options.relations || GetRelationsTableName(this.repository.metadata);

    const result = await this.repository.findOne(id, options);

    if (!result) {
      throw new HttpException(`${this.constructor.name} FindById with id: (${id}) Not Found`, 404);
    }

    if (result.isDeleted) {
      throw new HttpException(`${this.constructor.name} record with id: "${id}" Has Been Deleted`, 404);
    }

    return this.mapper.entityToDto(result);
  }

  async findOne(param: ObjectLiteral, options?: FindOneOptions<TEntity>): Promise<TDto> {
    options = options || {};
    options.cache = true;
    options.relations = options.relations || GetRelationsTableName(this.repository.metadata);

    const result = await this.repository.findOne({ ...param } as FindConditions<TEntity>, options);

    return this.mapper.entityToDto(result);
  }

  async findAll(
    filter: IFilter = {
      offset: 0,
      limit: 10,
      isShowDeleted: false,
    },
  ): Promise<TDto[]> {
    const findOptions = this.resolveFindOptions(filter);

    // execute query
    const result = await this.repository.find(findOptions);

    // convert entity to DTO before return
    return Promise.all(
      result.map(entity => {
        return this.mapper.entityToDto(entity);
      }),
    );
  }

  async create(data: TDto, doValidation: boolean = true): Promise<TDto> {
    if (doValidation) {
      await data.validate();
    }

    if (!data.__meta) {
      data.__meta = {};
    }

    data.__meta.dataStatus = DataStatus.Submitted;
    data.isDeleted = false;

    const entity = await this.mapper.dtoToEntity(data);

    await this.repository.save(entity as any);

    return this.mapper.entityToDto(entity);
  }

  async update(id: string, data: TDto, doValidation: boolean = true): Promise<TDto> {
    if (doValidation) {
      await data.validate();
    }

    const toEntity = await this.mapper.dtoToEntity(data);

    const beforeUpdate = await this.findOne({ id } as any);

    // make sure updated id was not altered
    toEntity.id = id;

    this.repository.save(toEntity as any);

    return this.mapper.entityToDto(toEntity);
  }

  async destroy(id: string): Promise<void> {
    const entity = await this.repository.findOneOrFail(id);

    if (this.config.softDelete && !entity.isDeleted) {
      // tslint:disable-next-line:no-any
      const deletedObj: any = {
        isDeleted: true,
      };

      await this.repository.update(id, deletedObj);
    } else {
      await this.repository.delete(id);
    }
  }

  async destroyBulk(ids: string[]): Promise<{ [key: string]: string }> {
    const result: { [key: string]: string } = {};

    await Promise.all(
      ids.map(async id => {
        try {
          await this.destroy(id);
        } catch (e) {
          result[id] = e.messages;
        }
      }),
    );

    return result;
  }

  private resolveFindOptions(filter: IFilter): FindManyOptions {
    if (!filter.relations) {
      filter.relations = GetRelationsTableName(this.repository.metadata);
    }

    let where: FindConditions<TEntity> = {};

    if (filter.where && !_.isEmpty(filter.where)) {
      where = this.resolveWhereOperator(filter.where);
    }

    if (filter.isShowDeleted) {
      (where as any).isDeleted = true;
    } else {
      (where as any).isDeleted = false;
    }

    const whereOrs: FindConditions<TEntity>[] = [];

    if (filter.whereOr && !_.isEmpty(filter.whereOr)) {
      whereOrs.push({ ...(where || {}), ...this.resolveWhereOperator(filter.whereOr) });
    }

    const order: { [P in keyof TEntity]?: 'ASC' | 'DESC' | 1 | -1 } = {};

    if (filter.order) {
      filter.order.map(ord => {
        const orders = ord.split(' ');
        if (orders.length === 2) {
          order[orders[0]] = orders[1];
        }
      });
    }

    const result: FindManyOptions = {
      relations: filter.relations,
      where: whereOrs && whereOrs.length > 0 ? whereOrs : where,
      order,
      skip: filter.offset,
      take: filter.limit,
      cache: true,
    };

    return result;
  }

  private resolveWhereOperator(source: object): FindConditions<TEntity> {
    const result: FindConditions<TEntity> = {};

    _.forEach(source, (val: string, prop: string) => {
      const value: string = val;

      const propertyType = GetPropertyType(this.repository.metadata.columns, prop);

      if (
        propertyType &&
        (propertyType === 'boolean' ||
          propertyType === 'bool' ||
          propertyType === 'uuid' ||
          ColumnIsNumber(propertyType))
      ) {
        result[prop] = value;
      } else {
        result[prop] = Like('%' + value + '%');
      }
    });

    return result;
  }
}