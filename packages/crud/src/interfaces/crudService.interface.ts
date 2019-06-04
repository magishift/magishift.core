import { DefaultRoles } from '@magishift/auth';
import { FindOneOptions, ObjectLiteral } from 'typeorm';
import { ICrudConfig, ICrudDto, ICrudEntity } from './crud.interface';
import { IFilter } from './filter.interface';
import { IFormSchema } from './form.interface';
import { IGridSchema } from './grid.interface';

export interface IServiceConfig {
  softDelete: boolean;
}

export interface ICrudService<TEntity extends ICrudEntity, TDto extends ICrudDto> {
  getCrudConfig(): ICrudConfig;

  getFormSchema(isDraft?: string, isDeleted?: string): IFormSchema;

  getGridSchema(): IGridSchema;

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
    param: ObjectLiteral,
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
