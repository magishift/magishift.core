import { CrudDto } from '../../src';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TestDto extends CrudDto {
  @ApiModelProperty()
  @IsString()
  testAttribute: string;
}
