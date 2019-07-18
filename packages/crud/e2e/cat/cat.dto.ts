import { MagiDto } from '../../src';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CatDto extends MagiDto {
  @ApiModelProperty()
  @IsString()
  catAttribute: string;
}
