import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField } from '../../../src/crud/form.decorator';
import { FieldTypes } from '../../../src/crud/interfaces/form.interface';
import { IAutocompleteDto } from './interfaces/autocomplete.interface';

@Form()
export class AutocompleteDto extends CrudDto implements IAutocompleteDto {
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Autocomplete',
    messages: 'This is field messages',
    isDebug: true,
    type: FieldTypes.Autocomplete,
    choices: ['A', 'B', 'C', 'D'],
  })
  autocomplete: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Autocomplete Required',
    required: true,
    isDebug: true,
    type: FieldTypes.Autocomplete,
    choices: ['A', 'B', 'C', 'D'],
  })
  autocompleteRequired: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Autocomplete Disabled',
    disabled: true,
    isDebug: true,
    value: 'Disabled',
    type: FieldTypes.Autocomplete,
    choices: ['Disabled', 'A', 'B', 'C', 'D'],
  })
  autocompleteDisabled: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Autocomplete Readonly',
    readonly: true,
    isDebug: true,
    type: FieldTypes.Autocomplete,
    choices: ['Readonly', 'A', 'B', 'C', 'D'],
    value: 'Readonly',
  })
  autocompleteReadonly: string;
}
