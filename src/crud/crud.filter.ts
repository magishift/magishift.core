import { ApiModelProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';
import { ICrudDto } from './interfaces/crud.interface';
import { IFilter } from './interfaces/filter.interface';

@ArgsType()
export class Filter<TDto extends ICrudDto> implements IFilter {
  @ApiModelProperty()
  where?: Partial<TDto>;

  @ApiModelProperty()
  whereOr?: Partial<TDto>;

  @Field(() => [String], {
    nullable: true,
    description: 'ex. ["id ASC", "title DESC"]',
    defaultValue: ['id ASC'],
  })
  @ApiModelProperty()
  order?: string[];

  @Field(() => Int, { nullable: true })
  @ApiModelProperty()
  @Min(1)
  @Max(1000)
  limit?: number;

  @Field(() => Int, { nullable: true })
  @ApiModelProperty()
  @Min(0)
  offset?: number;

  @ApiModelProperty()
  isShowDeleted?: boolean;

  @ApiModelProperty()
  relations?: string[];

  constructor(partial: Partial<Filter<TDto>>) {
    Object.assign(this, partial);
  }
}
