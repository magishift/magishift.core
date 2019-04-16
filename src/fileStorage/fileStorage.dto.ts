import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsInstance, IsOptional, IsString } from 'class-validator';
import { CrudDto } from '../crud/crud.dto';
import { IFile, IFileStorageDto } from './interfaces/fileStorage.interface';

export class FileStorageDto extends CrudDto implements IFileStorageDto {
  @IsString()
  @ApiModelProperty()
  ownerId: string;

  @IsString()
  @ApiModelProperty()
  object: string;

  @IsString()
  @ApiModelProperty()
  type: string;

  @IsString()
  @ApiModelProperty()
  url: string;

  @IsInstance(Object)
  @ApiModelProperty()
  meta: object;

  @IsArray()
  permissions: string[];
  @ApiModelProperty()
  @IsOptional()
  @ApiModelProperty()
  file: IFile;

  @IsString()
  @ApiModelProperty()
  dataStatus: 'temp' | 'submitted';

  storage: 'local' | 'S3' = 'local';
}
