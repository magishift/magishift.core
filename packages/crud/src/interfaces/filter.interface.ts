import { ApiModelProperty } from '@nestjs/swagger';

export interface IFilter {
  offset?: number;
  where?: Partial<any>;
  whereOr?: Partial<any>;
  order?: string[];
  limit?: number;
  isShowDeleted?: boolean;
  relations?: string[];
}

export abstract class IFindAllResult {
  @ApiModelProperty()
  totalCount: number;
}
