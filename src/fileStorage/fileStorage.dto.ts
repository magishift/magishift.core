import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsInstance, IsOptional, IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { CrudDto } from '../crud/crud.dto';
import { IFile, IFileStorageDto } from './interfaces/fileStorage.interface';

@ObjectType('FileStorage')
@InputType('FileStorageInput')
export class FileStorageDto extends CrudDto implements IFileStorageDto {
  @IsString()
  @Field()
  @ApiModelProperty()
  ownerId: string;

  @IsString()
  @Field()
  @ApiModelProperty()
  object: string;

  @IsString()
  @Field()
  @ApiModelProperty()
  type: string;

  @IsString()
  @Field()
  @ApiModelProperty()
  url: string;

  @IsInstance(Object)
  @ApiModelProperty()
  meta: object;

  @IsArray()
  @ApiModelProperty()
  permissions: string[];

  @IsOptional()
  @ApiModelProperty()
  file: IFile;

  @IsString()
  @ApiModelProperty()
  dataStatus: 'temp' | 'submitted';

  @IsString()
  @ApiModelProperty()
  storage: 'local' | 'S3' = 'local';
}
