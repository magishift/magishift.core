import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { ICrudDto, IDataMeta } from './interfaces/crud.interface';

export abstract class CrudDto implements ICrudDto {
  @IsOptional()
  @IsUUID()
  @ApiModelProperty({ required: false, readOnly: true })
  id: string;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty({ required: false, default: false })
  isDeleted: boolean;

  __meta: IDataMeta = {};
}
