import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { IFilter } from './interfaces/filter.interface';
import { IMagiDto } from './interfaces/magi.interface';

export abstract class MagiFilter<TDto extends IMagiDto> implements IFilter {
  abstract where: Partial<TDto>;

  abstract whereOr: Partial<TDto>;

  @IsOptional()
  @IsArray()
  @ApiModelProperty({ required: false, type: String, description: '["id ASC"]' })
  order?: string[];

  @ApiModelProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number;

  @ApiModelProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty({ required: false, type: String, description: '["relationA", "relationB"]' })
  relations?: string[];

  isShowDeleted?: boolean;

  constructor(partial: Partial<MagiFilter<TDto>>) {
    Object.assign(this, partial);
  }
}
