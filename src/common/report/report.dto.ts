import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CrudDto } from '../crud/crud.dto';
import { Form, FormField } from '../crud/form.decorator';
import { Grid, GridColumn } from '../crud/grid.decorator';
import { IReportDto } from './interfaces/report.interface';

@Grid()
@Form()
export class ReportDto extends CrudDto implements IReportDto {
  @IsNumber()
  @ApiModelProperty()
  @FormField({ label: 'Index', required: true })
  @GridColumn({ text: 'Index', searchAble: true })
  index: number;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Url', required: true })
  @GridColumn({ text: 'Url', searchAble: true })
  url: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Authorization', required: true })
  @GridColumn({ text: 'Authorization', searchAble: true })
  authorization: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Authorization', required: true })
  @GridColumn({ text: 'Authorization', searchAble: true })
  method: 'GET' | 'POST';
}
