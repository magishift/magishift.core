import { CrudDto } from '../../src';
import { ApiModelProperty } from '@nestjs/swagger';
import { ITestDto } from './interfaces/test.interface';
import { IsString } from 'class-validator';

export class TestDto extends CrudDto implements ITestDto {
  @ApiModelProperty()
  @IsString()
  testAttribute: string;
}
