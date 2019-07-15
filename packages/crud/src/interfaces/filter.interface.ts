import { ApiModelProperty } from '@nestjs/swagger';
import { CrudDto } from '../crud.dto';
import { ICrudDto } from './crud.interface';

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

export abstract class IFindAllResult<TDto extends ICrudDto> {
  @ApiModelProperty()
  totalCount: number;

  @ApiModelProperty({ type: CrudDto, isArray: true })
  items: TDto[];
}
