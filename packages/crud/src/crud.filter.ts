import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ICrudDto } from './interfaces/crud.interface';
import { IFilter } from './interfaces/filter.interface';

export class Filter<TDto extends ICrudDto> implements IFilter {
  @IsOptional()
  @ApiModelProperty({ required: false })
  where?: Partial<TDto>;

  @IsOptional()
  @ApiModelProperty({ required: false })
  whereOr?: Partial<TDto>;

  @IsOptional()
  @IsArray()
  @ApiModelProperty({ required: false, type: String, isArray: true, example: 'id ASC' })
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
  @ApiModelProperty({ required: false })
  isShowDeleted?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty({ required: false, isArray: true })
  relations?: string[];

  constructor(partial: Partial<Filter<TDto>>) {
    Object.assign(this, partial);
  }
}
