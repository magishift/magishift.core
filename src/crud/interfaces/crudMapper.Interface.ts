import { DeepPartial, ObjectLiteral } from 'typeorm';
import { IBaseMapper } from '../../base/interfaces/baseMapper.Interface';
import { ICrudDto, ICrudEntity } from './crud.interface';

export interface ICrudMapper<TEntity extends ICrudEntity, TDto extends ICrudDto> extends IBaseMapper {
  dtoToEntity(dto: TDto): Promise<TEntity>;

  entityToDto(entity: DeepPartial<TEntity> | TEntity | ObjectLiteral): Promise<TDto>;

  dtoFromObject(obj: TDto): Promise<TDto>;
}
