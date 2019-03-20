import { HttpException } from '@nestjs/common';
import _ = require('lodash');
import { Brackets, FindConditions, FindOneOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { v4 as uuid } from 'uuid';
import { DefaultRoles } from '../auth/role/role.const';
import { SessionUtil } from '../auth/session.util';
import { BaseService } from '../base/base.service';
import { DataStatus } from '../base/interfaces/base.interface';
import { getPropertyType, getRelationsName, isPropertyTypeNumber } from '../database/utils.database';
import { GetFormSchema, GetGridSchema } from './crud.util';
import { Draft } from './draft/draft.entity.mongo';
import { DraftService } from './draft/draft.service';
import { ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudService, IServiceConfig } from './interfaces/crudService.interface';
import { IFilter } from './interfaces/filter.interface';
import { IFormSchema } from './interfaces/form.interface';

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

  async getFormSchema(id?: string, isDraft?: string, isDeleted?: string): Promise<IFormSchema> {
    const result = Object.assign(GetFormSchema(this.constructor.name));
    result.schema.model = null;

    if (id) {
      if (isDraft && isDraft !== 'false') {
        result.schema.model = await this.fetchDraft(id);
      } else if (isDeleted && isDeleted !== 'false') {
        result.schema.model = await this.findOne({ id, isDeleted: true } as any);
      } else {
        result.schema.model = await this.fetch(id);
      }
    } else {
      // on create, define form ID
      // this ID will be used to mark owner ID for uploaded file
      // and latter will be used as object ID
      result.schema.model = {
        id: uuid(),
      };
    }

    return result;
  }

  getGridSchema(): object {
    return Object.assign(GetGridSchema(this.constructor.name));
  }

  async isExist(id: string): Promise<boolean> {
    return !!(await this.repository.findOne(id));
  }

  async count(
    filter: IFilter = {
      offset: 0,
      limit: -1,
      isShowDraft: false,
      isShowDeleted: false,
    },
  ): Promise<number> {
    const query = this.queryBuilder(filter);

    query.limit = undefined;
    query.offset = undefined;

    const result = await query.getCount();

    return result;
  }

  async fetch(
    id: string,
    options?: FindOneOptions<TEntity>,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto> {
    options = options || {};

    options.relations = options.relations || getRelationsName(this.repository.metadata.columns);

    const result = await this.repository.findOne(id, options);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
      result.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can read`, 403);
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
    param: QueryDeepPartialEntity<TEntity>,
    options?: FindOneOptions<TEntity>,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto> {
    options = options || {};

    options.relations = options.relations || getRelationsName(this.repository.metadata.columns);

    const conditions = { ...param } as FindConditions<TEntity>;

    const result = await this.repository.findOne(conditions, options);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
      result.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can read`, 403);
    }

    return this.mapper.entityToDto(result);
  }

  async findAll(
    filter: IFilter = {
      offset: 0,
      limit: 10,
      isShowDraft: false,
      isShowDeleted: false,
    },
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto[]> {
    const query = this.queryBuilder(filter);

    // execute query
    const result = await query.getMany();

    // convert entity to DTO before return
    return Promise.all(
      result.map(async entity => {
        if (
          permissions &&
          permissions.indexOf(DefaultRoles.owner) >= 0 &&
          SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
          entity.__meta.dataOwner !== SessionUtil.getAccountId
        ) {
          throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can read`, 403);
        } else {
          return this.mapper.entityToDto(entity);
        }
      }),
    );
  }

  async fetchDraft(
    id: string,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto> {
    const result = await this.draftService.fetch(id, this.constructor.name);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
      result.data.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can read this draft`, 403);
    }

    return result.data as TDto;
  }

  async findAllDrafts(
    filter: IFilter = {
      offset: 0,
      limit: -1,
      isShowDraft: false,
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

  async create(data: TDto, doValidation: boolean = true): Promise<void> {
    if (doValidation) {
      await data.validate();
    }

    if (!data.__meta) {
      data.__meta = {};
    }

    data.__meta.dataStatus = DataStatus.Submitted;
    data.isDeleted = false;

    const toEntity = await this.mapper.dtoToEntity(data);

    await this.repository.insert(toEntity);

    if (await this.draftService.isExist(data.id)) {
      this.draftService.delete(data.id);
    }
  }

  async update(
    id: string,
    data: TDto,
    doValidation: boolean = true,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<void> {
    if (doValidation) {
      await data.validate();
    }

    const entity = await this.mapper.dtoToEntity(data);

    const beforeUpdate = await this.fetch(id);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
      beforeUpdate.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can update this data`, 403);
    }

    // delete id to prevent id changed accidentally
    delete entity.id;

    await this.repository.update(id, entity);
  }

  async destroy(
    id: string,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<void> {
    const entity = await this.repository.findOneOrFail(id);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
      entity.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can delete this data`, 403);
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

  async destroyBulk(
    ids: string[],
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<{ [key: string]: string }> {
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

  async destroyDraft(
    id: string,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<void> {
    const result = await this.draftService.fetch(id, this.constructor.name);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
      result.data.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can delete this draft`, 403);
    }

    await this.draftService.delete(id);
  }

  private queryBuilder(filter: IFilter): SelectQueryBuilder<TEntity> {
    const tableName = this.repository.metadata.name;

    const query = this.repository
      .createQueryBuilder(tableName)
      .offset(filter.offset || 0)
      .limit(filter.limit === null || filter.limit === undefined ? 10 : filter.limit);

    // show deleted
    query.andWhere(`"${tableName}"."isDeleted" = ${!!filter.isShowDeleted}`);

    // resolve relations
    if (!filter.relations) {
      filter.relations = getRelationsName(this.repository.metadata.columns);
    }

    filter.relations.map(val => {
      query.leftJoinAndSelect(`${tableName}.${val}`, val);
    });

    if (filter.where) {
      const whereStrings = this.queryWhereBuilder(filter.where, tableName);
      if (whereStrings.length > 0) {
        whereStrings.map(whereString => {
          if (whereString) {
            query.andWhere(whereString);
          }
        });
      }
    }

    if (filter.whereOr) {
      const whereStringOrs = this.queryWhereBuilder(filter.whereOr, tableName);
      if (whereStringOrs.length > 0) {
        query.andWhere(
          new Brackets(qb => {
            whereStringOrs.map(whereStringOr => {
              if (whereStringOr) {
                qb.orWhere(whereStringOr);
              }
            });
          }),
        );
      }
    }

    // resolve order by
    if (filter.order && filter.order.length > 0) {
      let isNewOrder: boolean = true;

      filter.order.forEach(val => {
        const split = val.split(' ');

        const orderBy = this.getFieldPath(split[0]) || split[0];

        const orderDirection = split[1] as 'ASC' | 'DESC';

        // check if where condition is for nested join column
        const keySplit = orderBy.split('.');

        let orderKey = `"${tableName}"."${orderBy}"`;

        if (keySplit.length > 1) {
          orderKey = `"${keySplit.join('"."')}"`;
        }

        if (isNewOrder) {
          query.orderBy(orderKey, orderDirection);
          isNewOrder = false;
        } else {
          query.addOrderBy(orderKey, orderDirection);
        }
      });
    }

    return query;
  }

  private queryWhereBuilder(where: object, tableName: string): string[] {
    const result: string[] = [];

    Object.keys(where).map(key => {
      let whereCondition: string;

      // check if where condition is for nested join column
      const keySplit = key.split('.');

      if (keySplit.length > 1) {
        whereCondition = `"${keySplit.join('"."')}"`;
      } else {
        whereCondition = `"${tableName}"."${this.getFieldPath(key)}"`;
      }

      const propertyType = getPropertyType(this.repository.metadata.columns, key);

      if (
        propertyType &&
        (propertyType === 'boolean' ||
          propertyType === 'bool' ||
          propertyType === 'uuid' ||
          isPropertyTypeNumber(propertyType))
      ) {
        result.push(`${whereCondition} = '${where[key].plain || where[key]}'`);
      } else {
        result.push(`${whereCondition} ~* '.*${where[key].plain || where[key]}'`);
      }
    });

    return result;
  }

  private getFieldPath(propertyName: string): string {
    const property: ColumnMetadata = _.find(this.repository.metadata.columns, { propertyName });
    return property && property.databaseName;
  }
}
