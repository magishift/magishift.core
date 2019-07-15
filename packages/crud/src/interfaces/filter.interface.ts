import { ApiModelProperty } from '@nestjs/swagger';
import { CrudDto } from '../crud.dto';

export interface IFilter {
  offset?: number;
  where?: Partial<any>;
  whereOr?: Partial<any>;
  order?: string[];
  limit?: number;
  isShowDeleted?: boolean;
  relations?: string[];
}

export abstract class IFindAllResult<TDto extends CrudDto> {
  @ApiModelProperty()
  totalCount: number;

  @ApiModelProperty({ type: CrudDto, isArray: true })
  items: TDto[];
}
