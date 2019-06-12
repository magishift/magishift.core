import { ApiModelProperty } from '@nestjs/swagger';
import { CrudDto } from '../crud.dto';

export abstract class IFilter {
  @ApiModelProperty()
  offset?: number;

  @ApiModelProperty()
  where?: Partial<any>;

  @ApiModelProperty()
  whereOr?: Partial<any>;

  @ApiModelProperty()
  order?: string[];

  @ApiModelProperty()
  limit?: number;

  @ApiModelProperty()
  isShowDeleted?: boolean;

  @ApiModelProperty()
  relations?: string[];
}

export abstract class IFindAllResult<TDto extends CrudDto> {
  @ApiModelProperty()
  totalCount: number;

  @ApiModelProperty({ type: CrudDto, isArray: true })
  items: TDto[];
}
