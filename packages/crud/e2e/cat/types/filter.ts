import { CatDto } from '../cat.dto';
import { IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { MagiFilter } from '../../../src';

export class Filter extends MagiFilter<CatDto> {
  @IsOptional()
  @ApiModelProperty({
    required: false,
    type: CatDto,
    description: 'ex: {"id" : /001/,  "name" : /a/} => Filter where id contain "001" AND name contain "a"',
  })
  where: Partial<CatDto>;

  @IsOptional()
  @ApiModelProperty({
    required: false,
    type: CatDto,
    description: 'ex: {"id" : /001/, "name" : /a/} => Filter where id contain "001" OR name contain "a"',
  })
  whereOr: Partial<CatDto>;
}
