import { DeepPartial, ObjectLiteral } from 'typeorm';

export interface ICrudMapper<TEntity extends any, TDto extends any> {
  dtoToEntity(dto: TDto): Promise<TEntity>;

  entityToDto(entity: DeepPartial<TEntity> | TEntity | ObjectLiteral): Promise<TDto>;
}
