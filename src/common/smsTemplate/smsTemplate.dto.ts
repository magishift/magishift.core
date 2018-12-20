import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../crud/crud.dto';
import { Form, FormField } from '../../crud/form.decorator';
import { Grid, GridColumn } from '../../crud/grid.decorator';
import { FieldTypes } from '../../crud/interfaces/form.interface';
import { ISmsTemplateDto } from './interfaces/smsTemplate.interface';

@Grid()
@Form()
export class SmsTemplateDto extends CrudDto implements ISmsTemplateDto {
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Type',
    type: FieldTypes.Text,
    required: true,
  })
  @GridColumn({ text: 'Type', searchAble: true })
  type: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Template', type: FieldTypes.HTML, required: true })
  template: string;
}
