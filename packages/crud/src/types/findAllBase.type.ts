import { ApiModelProperty } from '@nestjs/swagger';

export abstract class FindAllBase {
  @ApiModelProperty()
  totalRecords: number;

  abstract items: any[];
}
