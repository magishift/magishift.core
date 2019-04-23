import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../crud/crud.mapper';
import { FileStorageDto } from './fileStorage.dto';
import { FileStorage } from './fileStorage.entity';
import { IFileStorage, IFileStorageDto } from './interfaces/fileStorage.interface';

@Injectable()
export class FileStorageMapper extends CrudMapper<IFileStorage, IFileStorageDto> {
  constructor() {
    super(FileStorage, FileStorageDto);
  }

  async dtoToEntity(dto: IFileStorageDto): Promise<IFileStorage> {
    const entity = await super.dtoToEntity(dto);

    entity.meta = dto.file;
    entity.permissions = dto.permissions;

    return entity;
  }

  async entityToDto(entity: IFileStorage): Promise<IFileStorageDto> {
    const dto = await super.entityToDto(entity);

    dto.file = entity.meta;
    dto.permissions = entity.permissions;

    return dto;
  }
}
