import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField } from '../../../src/crud/form.decorator';
import { FieldTypes } from '../../../src/crud/interfaces/form.interface';
import { ICheckboxDto } from './interfaces/checkbox.interface';

@Form()
export class CheckboxDto extends CrudDto implements ICheckboxDto {
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Checkbox', isDebug: true, type: FieldTypes.Checkbox, value: true })
  checkbox: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Checkbox Disabled',
    disabled: true,
    isDebug: true,
    value: true,
    type: FieldTypes.Checkbox,
  })
  checkboxDisabled: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Checkbox Readonly',
    readonly: true,
    isDebug: true,
    value: false,
    type: FieldTypes.Checkbox,
  })
  checkboxReadonly: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Checkboxes',
    isDebug: true,
    type: FieldTypes.Checkboxes,
    choices: { a: 'Option A', b: 'Option B', c: 'Option C' },
  })
  checkboxes: string;
}
