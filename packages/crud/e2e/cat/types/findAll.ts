import { ApiModelProperty } from '@nestjs/swagger';
import { CatDto } from '../cat.dto';
import { FindAllBase } from '../../../src';

export class FindAll extends FindAllBase {
  @ApiModelProperty({ type: CatDto, isArray: true })
  items: CatDto[];
}
