import { DeepPartial, ObjectLiteral } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseMapper } from '../../base/interfaces/baseMapper.Interface';
import { ICrudDto, ICrudEntity } from './crud.interface';

export interface ICrudMapper<TEntity extends ICrudEntity, TDto extends ICrudDto> extends IBaseMapper {
  dtoToEntity(dto: TDto): Promise<QueryDeepPartialEntity<TEntity>>;

  entityToDto(entity: DeepPartial<TEntity> | TEntity | ObjectLiteral): Promise<TDto>;

  dtoFromObject(obj: TDto): Promise<TDto>;
}
