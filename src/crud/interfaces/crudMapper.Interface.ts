import { DeepPartial } from 'typeorm';
import { IBaseMapper } from '../../base/interfaces/baseMapper.Interface';
import { ICrudDto, ICrudEntity } from './crud.interface';

export interface ICrudMapper<TEntity extends ICrudEntity, TDto extends ICrudDto> extends IBaseMapper {
  dtoToEntity(dto: TDto): Promise<DeepPartial<TEntity>>;

  entityToDto(entity: DeepPartial<TEntity> | TEntity): Promise<TDto>;

  dtoFromObject(obj: TDto): Promise<TDto>;
}
