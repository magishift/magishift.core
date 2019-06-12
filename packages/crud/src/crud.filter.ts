import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ICrudDto } from './interfaces/crud.interface';
import { IFilter } from './interfaces/filter.interface';

export class Filter<TDto extends ICrudDto> implements IFilter {
  @IsOptional()
  @ApiModelProperty()
  where?: Partial<TDto>;

  @IsOptional()
  @ApiModelProperty()
  whereOr?: Partial<TDto>;

  @IsOptional()
  @IsArray()
  @ApiModelProperty()
  order?: string[];

  @ApiModelProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty()
  isShowDeleted?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty()
  relations?: string[];

  constructor(partial: Partial<Filter<TDto>>) {
    Object.assign(this, partial);
  }
}
