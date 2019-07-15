import { ICrudDto } from './crud.interface';
import { IFilter } from './filter.interface';

export interface ICrudController<TDto extends ICrudDto> {
  findAll(filter?: IFilter, ...rest: any[]): Promise<{ items: TDto[]; totalCount: number }>;

  fetchById(id: string, ...rest: any[]): Promise<TDto>;

  openDeleted(filter?: IFilter, ...rest: any[]): Promise<{ items: TDto[]; totalCount: number }>;

  fetchDeletedById(id: string, ...rest: any[]): Promise<TDto>;

  create(data: TDto, ...rest: any[]): Promise<TDto>;

  update(id: string, data: object, ...rest: any[]): Promise<TDto>;

  delete(id: string, ...rest: any[]): Promise<void>;

  deleteBulk(
    ids: string,
    ...rest: any[]
  ): Promise<{
    [key: string]: string;
  }>;

  destroy(id: string, ...rest: any[]): Promise<void>;

  destroyBulk(
    ids: string,
    ...rest: any[]
  ): Promise<{
    [key: string]: string;
  }>;
}
