import { HttpException, HttpStatus } from '@nestjs/common';
import _ = require('lodash');
import { FindConditions, FindManyOptions, FindOneOptions, Like, ObjectLiteral, Repository } from 'typeorm';
import { DefaultRoles } from '../auth/role/defaultRoles';
import { SessionUtil } from '../auth/session.util';
import { BaseService } from '../base/base.service';
import { DataStatus } from '../base/interfaces/base.interface';
import { ColumnIsNumber, GetPropertyType, GetRelationsTableName } from '../database/utils.database';
import { GetFormSchema, GetGridSchema, GetKanbanSchema } from './crud.util';
import { Draft } from './draft/draft.entity.mongo';
import { DraftService } from './draft/draft.service';
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
    protected readonly draftService: DraftService,
    protected readonly mapper: ICrudMapper<TEntity, TDto>,
    protected readonly config: IServiceConfig = { softDelete: true },
  ) {
    super(repository, config);
  }

  getCrudConfig(): ICrudConfig {
    return {
      kanban: this.getKanbanSchema(),
      grid: this.getGridSchema(),
      form: this.getFormSchema(),
      softDelete: this.config.softDelete,
      enableDraft: !!this.draftService,
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

  async fetch(
    id: string,
    options?: FindOneOptions<TEntity>,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto> {
    options = options || {};
    options.cache = true;

    options.relations = options.relations || GetRelationsTableName(this.repository.metadata);

    const result = await this.repository.findOne(id, options);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getAccountRoles.indexOf(DefaultRoles.admin) < 0 &&
      result.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can read`, HttpStatus.FORBIDDEN);
    }

    if (!result) {
      throw new HttpException(`${this.constructor.name} FindById with id: (${id}) Not Found`, 404);
    }

    if (result.isDeleted) {
      throw new HttpException(`${this.constructor.name} record with id: "${id}" Has Been Deleted`, 404);
    }

    return this.mapper.entityToDto(result);
  }

  async findOne(
    param: ObjectLiteral,
    options?: FindOneOptions<TEntity>,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto> {
    options = options || {};
    options.cache = true;
    options.relations = options.relations || GetRelationsTableName(this.repository.metadata);

    const result = await this.repository.findOne({ ...param } as FindConditions<TEntity>, options);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getAccountRoles.indexOf(DefaultRoles.admin) < 0 &&
      result.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can read`, HttpStatus.FORBIDDEN);
    }

    return this.mapper.entityToDto(result);
  }

  async findAll(
    filter: IFilter = {
      offset: 0,
      limit: 10,
      isShowDeleted: false,
    },
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto[]> {
    const findOptions = this.resolveFindOptions(filter);

    // execute query
    const result = await this.repository.find(findOptions);

    // convert entity to DTO before return
    return Promise.all(
      result.map(entity => {
        if (
          permissions &&
          permissions.indexOf(DefaultRoles.owner) >= 0 &&
          SessionUtil.getAccountRoles.indexOf(DefaultRoles.admin) < 0 &&
          entity.__meta.dataOwner !== SessionUtil.getAccountId
        ) {
          throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can read`, HttpStatus.FORBIDDEN);
        } else {
          return this.mapper.entityToDto(entity);
        }
      }),
    );
  }

  async fetchDraft(id: string, permissions?: string[]): Promise<TDto> {
    const result = await this.draftService.fetch(id, this.constructor.name);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getAccountRoles.indexOf(DefaultRoles.admin) < 0 &&
      result.data.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(
        `Only ${DefaultRoles.admin} or owner of this data can read this draft`,
        HttpStatus.FORBIDDEN,
      );
    }

    return result.data as TDto;
  }

  async findAllDrafts(
    filter: IFilter = {
      offset: 0,
      limit: -1,
      isShowDeleted: false,
    },
  ): Promise<TDto[]> {
    const result = await this.draftService.findAllByService(this.constructor.name, filter);
    return result.map(data => data.data as TDto);
  }

  async saveAsDraft(data: TDto, doValidation: boolean = true): Promise<TDto> {
    if (doValidation) {
      await data.validate();
    }

    const draft = new Draft();
    draft.service = this.constructor.name;
    draft.data = data;

    const result = await this.draftService.write(draft);

    return result.data as TDto;
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

    if (await this.draftService.isExist(data.id)) {
      this.draftService.delete(data.id);
    }

    return this.mapper.entityToDto(entity);
  }

  async update(id: string, data: TDto, doValidation: boolean = true, permissions?: string[]): Promise<TDto> {
    if (doValidation) {
      await data.validate();
    }

    const toEntity = await this.mapper.dtoToEntity(data);

    const beforeUpdate = await this.findOne({ id } as any);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getAccountRoles.indexOf(DefaultRoles.admin) < 0 &&
      beforeUpdate.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(
        `Only ${DefaultRoles.admin} or owner of this data can update this data`,
        HttpStatus.FORBIDDEN,
      );
    }

    // make sure updated id was not altered
    toEntity.id = id;

    this.repository.save(toEntity as any);

    return this.mapper.entityToDto(toEntity);
  }

  async destroy(id: string, permissions?: string[]): Promise<void> {
    const entity = await this.repository.findOneOrFail(id);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getAccountRoles.indexOf(DefaultRoles.admin) < 0 &&
      entity.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(
        `Only ${DefaultRoles.admin} or owner of this data can delete this data`,
        HttpStatus.FORBIDDEN,
      );
    }

    if (this.config.softDelete && entity.__meta.dataStatus !== DataStatus.Draft && !entity.isDeleted) {
      // tslint:disable-next-line:no-any
      const deletedObj: any = {
        isDeleted: true,
      };

      await this.repository.update(id, deletedObj);
    } else {
      await this.repository.delete(id);
    }
  }

  async destroyBulk(ids: string[], permissions?: string[]): Promise<{ [key: string]: string }> {
    const result: { [key: string]: string } = {};

    await Promise.all(
      ids.map(async id => {
        try {
          await this.destroy(id, permissions);
        } catch (e) {
          result[id] = e.messages;
        }
      }),
    );

    return result;
  }

  async destroyDraft(id: string, permissions?: string[]): Promise<void> {
    const result = await this.draftService.fetch(id, this.constructor.name);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getAccountRoles.indexOf(DefaultRoles.admin) < 0 &&
      result.data.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(
        `Only ${DefaultRoles.admin} or owner of this data can delete this draft`,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.draftService.delete(id);
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
