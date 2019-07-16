import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { ICrudDto, IDataMeta } from './interfaces/crud.interface';

export abstract class CrudDto implements ICrudDto {
  @IsOptional()
  @IsUUID()
  @ApiModelProperty({ required: false, readOnly: true })
  id?: string;

  @IsOptional()
  @ApiModelProperty({ required: false, readOnly: true })
  publicId?: string;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty({ required: false, default: false })
  isDeleted?: boolean;

  @ApiModelProperty({ required: false, readOnly: true, type: IDataMeta })
  __meta?: IDataMeta = {};
}
