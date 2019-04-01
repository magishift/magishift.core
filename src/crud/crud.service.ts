import { HttpStatus } from '@nestjs/common';
import _ = require('lodash');
import { FindConditions, FindManyOptions, FindOneOptions, Like, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { DefaultRoles } from '../auth/role/defaultRoles';
import { SessionUtil } from '../auth/session.util';
import { BaseService } from '../base/base.service';
import { DataStatus } from '../base/interfaces/base.interface';
import { getRelationsTableName } from '../database/utils.database';
import { ExceptionHandler } from '../utils/error.utils';
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

    options.relations = options.relations || getRelationsTableName(this.repository.metadata);

    const result = await this.repository.findOne(id, options);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
      result.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      return ExceptionHandler(`Only ${DefaultRoles.admin} or owner of this data can read`, HttpStatus.FORBIDDEN);
    }

    if (!result) {
      return ExceptionHandler(`${this.constructor.name} FindById with id: (${id}) Not Found`, 404);
    }

    if (result.isDeleted) {
      return ExceptionHandler(`${this.constructor.name} record with id: "${id}" Has Been Deleted`, 404);
    }

    return this.mapper.entityToDto(result);
  }

  async findOne(
    param: TEntity,
    options?: FindOneOptions<TEntity>,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto> {
    options = options || {};

    options.relations = options.relations || getRelationsTableName(this.repository.metadata);

    const conditions: FindConditions<TEntity> = { ...param } as any;

    const result = await this.repository.findOne(conditions, options);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
      result.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      return ExceptionHandler(`Only ${DefaultRoles.admin} or owner of this data can read`, HttpStatus.FORBIDDEN);
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
          SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
          entity.__meta.dataOwner !== SessionUtil.getAccountId
        ) {
          return ExceptionHandler(`Only ${DefaultRoles.admin} or owner of this data can read`, HttpStatus.FORBIDDEN);
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
      return ExceptionHandler(
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

    this.repository.save(entity as any);

    if (await this.draftService.isExist(data.id)) {
      this.draftService.delete(data.id);
    }

    return this.mapper.entityToDto(entity);
  }

  async update(
    id: string,
    data: TDto,
    doValidation: boolean = true,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto> {
    if (doValidation) {
      await data.validate();
    }

    const toEntity = await this.mapper.dtoToEntity(data);

    const beforeUpdate = await this.fetch(id);

    if (
      permissions &&
      permissions.indexOf(DefaultRoles.owner) >= 0 &&
      SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0 &&
      beforeUpdate.__meta.dataOwner !== SessionUtil.getAccountId
    ) {
      return ExceptionHandler(
        `Only ${DefaultRoles.admin} or owner of this data can update this data`,
        HttpStatus.FORBIDDEN,
      );
    }

    // make sure updated id was not altered
    toEntity.id = id;

    this.repository.save(toEntity as any);

    return this.mapper.entityToDto(toEntity);
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
      return ExceptionHandler(
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
      return ExceptionHandler(
        `Only ${DefaultRoles.admin} or owner of this data can delete this draft`,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.draftService.delete(id);
  }

  private resolveFindOptions(filter: IFilter): FindManyOptions {
    if (!filter.relations) {
      filter.relations = getRelationsTableName(this.repository.metadata);
    }

    const where: FindConditions<TEntity> = filter.where;

    if (where) {
      Object.keys(where).map(w => {
        if (typeof where[w] === 'object' && where[w].plain) {
          where[w] = Like('%' + where[w].plain + '%');
        }
      });
    }

    const whereOr: FindConditions<TEntity>[] = [];

    if (filter.whereOr) {
      if (!_.isEmpty(where)) {
        whereOr.push(where);
      }

      Object.keys(filter.whereOr).map(w => {
        if (typeof filter.whereOr[w] === 'object' && filter.whereOr[w].plain) {
          const or = {};
          or[w] = Like('%' + filter.whereOr[w].plain + '%');

          whereOr.push(or);
        }
      });
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

    if (filter.isShowDeleted) {
      (where as any).isDeleted = true;
    }

    const result: FindManyOptions = {
      relations: filter.relations,
      where: whereOr && whereOr.length > 0 ? whereOr : where,
      order,
      skip: filter.offset,
      take: filter.limit,
      cache: true,
    };

    return result;
  }
}
