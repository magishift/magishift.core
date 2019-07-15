import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ICrudDto } from './interfaces/crud.interface';
import { IFilter } from './interfaces/filter.interface';

export abstract class Filter<TDto extends ICrudDto> implements IFilter {
  @IsOptional()
  @ApiModelProperty({ required: false, example: '{"id" : "001"}', description: 'Filter where' })
  where?: Partial<TDto>;

  @IsOptional()
  @ApiModelProperty({ required: false, example: '{"id" : "001"}', description: 'Filter where or' })
  whereOr?: Partial<TDto>;

  @IsOptional()
  @IsArray()
  @ApiModelProperty({ required: false, type: String, example: '["id ASC"]' })
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
  @ApiModelProperty({ required: false, type: String, example: '["relationA", "relationB"]' })
  relations?: string[];

  constructor(partial: Partial<Filter<TDto>>) {
    Object.assign(this, partial);
  }
}
