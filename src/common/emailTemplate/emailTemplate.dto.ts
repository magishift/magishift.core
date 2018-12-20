import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../crud/crud.dto';
import { Form, FormField } from '../../crud/form.decorator';
import { Grid, GridColumn } from '../../crud/grid.decorator';
import { FieldTypes } from '../../crud/interfaces/form.interface';
import { IEmailTemplateDto } from './interfaces/emailTemplate.interface';

@Grid()
@Form()
export class EmailTemplateDto extends CrudDto implements IEmailTemplateDto {
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
  @FormField({ label: 'Subject', required: true })
  subject: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Template', type: FieldTypes.HTML, required: true })
  template: string;
}
