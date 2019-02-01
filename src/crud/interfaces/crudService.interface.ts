import { DeepPartial, FindOneOptions } from 'typeorm';
import { DefaultRoles } from '../../auth/role/role.const';
import { ICrudDto, ICrudEntity } from './crud.interface';
import { IFilter } from './filter.interface';

export interface ICrudService<TEntity extends ICrudEntity, TDto extends ICrudDto> {
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
    param: DeepPartial<TEntity>,
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

  create(data: TDto, doValidation?: boolean): Promise<TDto>;

  update(
    id: string,
    data: TDto,
    doValidation?: boolean,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<TDto>;

  saveAsDraft(data: TDto, doValidation?: boolean): Promise<TDto>;

  destroy(
    id: string,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<boolean>;

  destroyBulk(
    ids: string[],
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<{ [name: string]: boolean }>;

  destroyDraft(
    id: string,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<boolean>;
}
