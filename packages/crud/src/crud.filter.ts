import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';
import { ICrudDto } from './interfaces/crud.interface';
import { IFilter } from './interfaces/filter.interface';

@ArgsType()
export class Filter<TDto extends ICrudDto> implements IFilter {
  @IsOptional()
  @ApiModelProperty()
  where?: Partial<TDto>;

  @IsOptional()
  @ApiModelProperty()
  whereOr?: Partial<TDto>;

  @IsOptional()
  @IsArray()
  @Field(() => [String], {
    nullable: true,
    description: 'ex. ["id ASC", "title DESC"]',
    defaultValue: ['id ASC'],
  })
  @ApiModelProperty()
  order?: string[];

  @Field(() => Int, { nullable: true })
  @ApiModelProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number;

  @Field(() => Int, { nullable: true })
  @ApiModelProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  @ApiModelProperty()
  isShowDeleted?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => [String], { nullable: true })
  @ApiModelProperty()
  relations?: string[];

  constructor(partial: Partial<Filter<TDto>>) {
    Object.assign(this, partial);
  }
}
