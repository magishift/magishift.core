import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CrudDto } from '../../crud/crud.dto';
import { Form, FormField } from '../../crud/form.decorator';
import { Grid, GridColumn } from '../../crud/grid.decorator';
import { FieldTypes } from '../../crud/interfaces/form.interface';
import { IReportDto } from './interfaces/report.interface';

@Grid()
@Form()
export class ReportDto extends CrudDto implements IReportDto {
  @IsNumber()
  @ApiModelProperty()
  @FormField({ label: 'Index', type: FieldTypes.Number })
  @GridColumn({ text: 'Index' })
  index: number;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Title', required: true })
  @GridColumn({ text: 'Title', searchAble: true })
  title: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Url', required: true })
  @GridColumn({ text: 'Url' })
  url: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Authorization' })
  @GridColumn({ text: 'Authorization' })
  authorization: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Method', value: 'GET', type: FieldTypes.Select, choices: ['GET', 'POST'] })
  @GridColumn({ text: 'Method' })
  method: 'GET' | 'POST' = 'GET';
}
