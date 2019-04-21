import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField } from '../../../src/crud/form.decorator';
import { FieldTypes } from '../../../src/crud/interfaces/form.interface';
import { ISelectDto } from './interfaces/select.interface';

@Form()
export class SelectDto extends CrudDto implements ISelectDto {
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Select',
    messages: 'This is field messages',
    isDebug: true,
    type: FieldTypes.Select,
    choices: ['A', 'B', 'C', 'D'],
  })
  select: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Select Required',
    required: true,
    isDebug: true,
    type: FieldTypes.Select,
    choices: ['A', 'B', 'C', 'D'],
  })
  selectRequired: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Select Disabled',
    disabled: true,
    isDebug: true,
    value: 'Disabled',
    type: FieldTypes.Select,
    choices: ['Disabled', 'A', 'B', 'C', 'D'],
  })
  selectDisabled: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Select Readonly',
    readonly: true,
    isDebug: true,
    type: FieldTypes.Select,
    choices: ['Readonly', 'A', 'B', 'C', 'D'],
    value: 'Readonly',
  })
  selectReadonly: string;

  @IsArray()
  @FormField({
    label: 'Select Multiple',
    type: FieldTypes.Select,
    multiple: true,
    choices: ['select me', 'select me too', 'me too!'],
  })
  selectMultiple: string[];

  @IsArray()
  @FormField({
    label: 'SelectMultiple required',
    type: FieldTypes.Select,
    multiple: true,
    required: true,
    choices: ['select me', 'select me too', 'me too!'],
  })
  selectMultipleRequired: string[];
}
