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

  getFormSchema(isDeleted?: string): IFormSchema;

  getGridSchema(): IGridSchema;

  count(filter: IFilter): Promise<number>;

  isExist(id: string): Promise<boolean>;

  fetch(id: string, options?: FindOneOptions<TEntity>): Promise<TDto>;

  findOne(param: ObjectLiteral, options?: FindOneOptions<TEntity>): Promise<TDto>;

  findAll(filter: IFilter): Promise<TDto[]>;

  create(data: TDto, doValidation?: boolean): Promise<TDto>;

  update(id: string, data: TDto, doValidation?: boolean): Promise<TDto>;

  destroy(id: string): Promise<void>;

  destroyBulk(ids: string[]): Promise<{ [key: string]: string }>;
}
