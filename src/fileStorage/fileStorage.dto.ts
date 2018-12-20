import { IsArray, IsInstance, IsOptional, IsString } from 'class-validator';
import { CrudDto } from '../crud/crud.dto';
import { IFile, IFileStorageDto } from './interfaces/fileStorage.interface';

export class FileStorageDto extends CrudDto implements IFileStorageDto {
  @IsString()
  ownerId: string;

  @IsString()
  object: string;

  @IsString()
  type: string;

  @IsString()
  url: string;

  @IsInstance(Object)
  meta: object;

  @IsArray()
  permissions: string[];

  @IsOptional()
  file: IFile;

  storage: 'local' | 'S3' = 'local';
}
