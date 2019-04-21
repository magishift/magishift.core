import { ApiModelProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { ICrudDto } from './interfaces/crud.interface';
import { IFilter } from './interfaces/filter.interface';

@ArgsType()
export class Filter<TDto extends ICrudDto> implements IFilter {
  @ApiModelProperty()
  where?: Partial<TDto>;

  @ApiModelProperty()
  whereOr?: Partial<TDto>;

  @Field(() => [String], { nullable: true })
  @ApiModelProperty()
  order?: string[];

  @Field({ nullable: true })
  @ApiModelProperty()
  @Min(1)
  @Max(1000)
  limit?: number;

  @Field({ nullable: true })
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
