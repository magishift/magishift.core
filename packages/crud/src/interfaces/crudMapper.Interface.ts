import { DeepPartial, ObjectLiteral } from 'typeorm';
import { ICrudDto, ICrudEntity } from './crud.interface';

export interface ICrudMapper<TEntity extends ICrudEntity, TDto extends ICrudDto> {
  dtoToEntity(dto: TDto): Promise<TEntity>;

  entityToDto(entity: DeepPartial<TEntity> | TEntity | ObjectLiteral): Promise<TDto>;

  dtoFromObject(obj: TDto): Promise<TDto>;
}
