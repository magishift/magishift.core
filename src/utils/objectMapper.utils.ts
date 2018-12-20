import { plainToClassFromExist } from 'class-transformer';
import 'reflect-metadata';
import { DeepPartial } from 'typeorm';
import { IBaseDto, IBaseEntity } from '../base/interfaces/base.interface';

export function Dto2Entity<TDto extends IBaseDto, TEntity extends IBaseEntity>(
  dto: TDto,
  entity: TEntity,
): DeepPartial<TEntity> {
  if (!dto) {
    return undefined;
  }

  Object.keys(dto).map(key => {
    entity[key] = dto[key];
  });

  // tslint:disable-next-line
  return entity as any;
}

export function Entity2Dto<TEntity extends IBaseEntity, TDto extends IBaseDto>(entity: TEntity, dto: TDto): TDto {
  if (!entity) {
    return undefined;
  }

  Object.keys(entity).map(key => {
    dto[key] = entity[key];
  });

  return dto;
}

export function DtoFromObject<TDto extends IBaseDto>(plain: object, dto: TDto): TDto {
  if (!plain) {
    return undefined;
  }

  const result = plainToClassFromExist(dto, plain);

  return result;
}
