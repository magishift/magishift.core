import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { IMagiDto } from './interfaces/magi.interface';
import { DataMeta } from './types/magi.type';

export abstract class MagiDto implements IMagiDto {
  @IsOptional()
  @IsUUID()
  @ApiModelProperty({ required: false, readOnly: true })
  id?: string;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty({ required: false, default: false })
  isDeleted: boolean;

  @ApiModelProperty({ required: false, readOnly: true, type: DataMeta })
  __meta?: DataMeta = {};
}
