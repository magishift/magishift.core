import { FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { DefaultRoles } from '../../auth/role/role.const';
import { ICrudDto, ICrudEntity } from './crud.interface';
import { IFilter } from './filter.interface';
import { IFormSchema } from './form.interface';

export interface IServiceConfig {
  softDelete: boolean;
}

export interface ICrudService<TEntity extends ICrudEntity, TDto extends ICrudDto> {
  getFormSchema(id?: string, isDraft?: string, isDeleted?: string): Promise<IFormSchema>;

  getGridSchema(): object;

  count(filter: IFilter): Promise<number>;

  isExist(id: string): Promise<boolean>;

  fetch(
    id: string,
    options?: FindOneOptions<TEntity>,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto>;

  fetchDraft(
    id: string,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto>;

  findOne(
    param: QueryDeepPartialEntity<TEntity>,
    options?: FindOneOptions<TEntity>,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto>;

  findAll(
    filter: IFilter,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto[]>;

  findAllDrafts(
    filter: IFilter,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto[]>;

  create(data: TDto, doValidation?: boolean): Promise<void>;

  update(
    id: string,
    data: TDto,
    doValidation?: boolean,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<void>;

  saveAsDraft(data: TDto, doValidation?: boolean): Promise<TDto>;

  destroy(
    id: string,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<void>;

  destroyBulk(
    ids: string[],
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<{ [key: string]: string }>;

  destroyDraft(
    id: string,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<void>;
}
