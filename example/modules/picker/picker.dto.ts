import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField } from '../../../src/crud/form.decorator';
import { FieldTypes } from '../../../src/crud/interfaces/form.interface';
import { IPickerDto } from './interfaces/picker.interface';

@Form()
export class PickerDto extends CrudDto implements IPickerDto {
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Date',
    messages: 'This is field messages',
    isDebug: true,
    type: FieldTypes.Date,
  })
  date: Date;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Time',
    isDebug: true,
    type: FieldTypes.Time,
  })
  time: Date;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Date Time',
    isDebug: true,
    type: FieldTypes.Datetime,
  })
  dateTime: Date;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Date Required',
    required: true,
    isDebug: true,
    type: FieldTypes.Date,
  })
  dateRequired: Date;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Date Time Disabled',
    disabled: true,
    isDebug: true,
    type: FieldTypes.Datetime,
  })
  dateTimeDisabled: Date;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Date Time Readonly',
    readonly: true,
    isDebug: true,
    type: FieldTypes.Datetime,
  })
  dateTimeReadonly: Date;
}
