import { DeepPartial, FindOneOptions } from 'typeorm';
import { ICrudDto, ICrudEntity } from './crud.interface';
import { IFilter } from './filter.interface';

export interface ICrudService<TEntity extends ICrudEntity, TDto extends ICrudDto> {
  count(filter: IFilter): Promise<number>;

  isExist(id: string): Promise<boolean>;

  fetch(id: string, options?: FindOneOptions<TEntity>): Promise<TDto>;

  fetchDraft(id: string): Promise<TDto>;

  findOne(param: DeepPartial<TEntity>, options?: FindOneOptions<TEntity>): Promise<TDto>;

  findAll(filter: IFilter): Promise<TDto[]>;

  findAllDrafts(filter: IFilter): Promise<TDto[]>;

  create(data: TDto, doValidation?: boolean): Promise<TDto>;

  update(id: string, data: TDto, doValidation?: boolean): Promise<TDto>;

  saveAsDraft(data: TDto, doValidation?: boolean): Promise<TDto>;

  destroy(id: string): Promise<boolean>;

  destroyBulk(ids: string[]): Promise<{ [name: string]: boolean }>;

  destroyDraft(id: string): Promise<boolean>;
}
