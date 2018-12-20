import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../../crud/crud.dto';
import { Form, FormField } from '../../../crud/form.decorator';
import { Grid, GridColumn } from '../../../crud/grid.decorator';
import { FieldTypes } from '../../../crud/interfaces/form.interface';
import { IGoogleCalendarDto } from './interfaces/googleCalendar.interface';

@Grid()
@Form()
export class GoogleCalendarDto extends CrudDto implements IGoogleCalendarDto {
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Email Notifications',
    type: FieldTypes.Text,
  })
  @GridColumn({ text: 'Email Notifications', searchAble: true })
  type: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Content', type: FieldTypes.HTML })
  @GridColumn({ text: 'Name', searchAble: true })
  template: string;
}
