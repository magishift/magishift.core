import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CrudMapper } from '../crud/crud.mapper';
import { Dto2Entity, Entity2Dto } from '../utils/objectMapper.utils';
import { FileStorageDto } from './fileStorage.dto';
import { FileStorage } from './fileStorage.entity';
import { IFileStorage, IFileStorageDto } from './interfaces/fileStorage.interface';

@Injectable()
export class FileStorageMapper extends CrudMapper<IFileStorage, IFileStorageDto> {
  constructor() {
    super(FileStorage, FileStorageDto);
  }

  async dtoToEntity(dto: IFileStorageDto): Promise<QueryDeepPartialEntity<IFileStorage>> {
    const entity = await Dto2Entity(dto, new FileStorage());

    entity.meta = JSON.stringify(dto.file);
    entity.permissions = JSON.stringify(dto.permissions);

    return entity;
  }

  async entityToDto(entity: IFileStorage): Promise<IFileStorageDto> {
    const dto = await Entity2Dto(entity, new FileStorageDto());

    dto.file = JSON.parse(entity.meta);
    dto.permissions = JSON.parse(entity.permissions);

    return dto;
  }
}
