import { ApiModelProperty } from '@nestjs/swagger';

export abstract class IFilter {
  @ApiModelProperty({ required: false })
  offset?: number;

  @ApiModelProperty({ required: false })
  where?: Partial<any>;

  @ApiModelProperty({ required: false })
  whereOr?: Partial<any>;

  @ApiModelProperty({ required: false })
  order?: string[];

  @ApiModelProperty({ required: false })
  limit?: number;

  @ApiModelProperty({ required: false })
  isShowDeleted?: boolean;

  @ApiModelProperty({ required: false })
  relations?: string[];
}

export abstract class IFindAllResult {
  @ApiModelProperty()
  totalCount: number;
}
