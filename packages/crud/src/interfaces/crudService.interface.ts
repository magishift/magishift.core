import { ApiModelProperty } from '@nestjs/swagger';
import { FindOneOptions, ObjectLiteral } from 'typeorm';
import { ICrudDto, ICrudEntity } from './crud.interface';
import { IFilter } from './filter.interface';

export abstract class IDeleteBulkResult {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  status: string;

  @ApiModelProperty()
  errorMessage: string;
}

export interface ICrudService<TEntity extends ICrudEntity, TDto extends ICrudDto> {
  count(filter: IFilter, ...rest: any[]): Promise<number>;

  isExist(id: string, ...rest: any[]): Promise<boolean>;

  fetch(id: string, options?: FindOneOptions<TEntity>, ...rest: any[]): Promise<TDto>;

  findOne(param: ObjectLiteral, options?: FindOneOptions<TEntity>, ...rest: any[]): Promise<TDto>;

  findAll(filter: IFilter, ...rest: any[]): Promise<TDto[]>;

  create(data: TDto, doValidation?: boolean, ...rest: any[]): Promise<TDto>;

  update(id: string, data: TDto, doValidation?: boolean, ...rest: any[]): Promise<TDto>;

  delete(id: string, ...rest: any[]): Promise<void>;

  deleteBulk(ids: string[], ...rest: any[]): Promise<IDeleteBulkResult[]>;

  destroy(id: string, ...rest: any[]): Promise<void>;

  destroyBulk(ids: string[], ...rest: any[]): Promise<IDeleteBulkResult[]>;
}
