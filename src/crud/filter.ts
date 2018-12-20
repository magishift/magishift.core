import { ApiModelProperty } from '@nestjs/swagger';
import { IFilter } from './interfaces/filter.interface';

export class Filter implements IFilter {
  @ApiModelProperty()
  offset: number;

  @ApiModelProperty()
  where?: object;

  @ApiModelProperty()
  whereOr?: object;

  @ApiModelProperty()
  order?: string[];

  @ApiModelProperty()
  limit: number;

  @ApiModelProperty()
  isShowDraft?: boolean;

  @ApiModelProperty()
  isShowDeleted?: boolean;

  @ApiModelProperty()
  relations?: string[];
}
