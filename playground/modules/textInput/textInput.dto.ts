import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField } from '../../../src/crud/form.decorator';
import { FieldTypes } from '../../../src/crud/interfaces/form.interface';
import { TEXT_INPUT_ENDPOINT } from './interfaces/textInput.const';
import { ITextInputDto } from './interfaces/textInput.interface';

@Form()
export class TextInputDto extends CrudDto implements ITextInputDto {
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Text Input', messages: 'This is field messages', isDebug: true })
  textInput: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Text Input Required', required: true, isDebug: true })
  textInputRequired: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Text Input Watch',
    watch: ['textInput', 'textInputRequired'],
    readonly: true,
    isDebug: true,
    isFullWidth: true,
  })
  textInputWatch: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Text Input Money',
    isDebug: true,
    type: FieldTypes.Money,
  })
  textInputMoney: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Text Input Callback',
    readonly: true,
    isDebug: true,
    callBack: TEXT_INPUT_ENDPOINT + '/calculate',
    messages: 'Text Input Money value * 1000',
    type: FieldTypes.Money,
  })
  textInputCallback: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Text Input HTML',
    isDebug: true,
    required: true,
    type: FieldTypes.HTML,
    messages: 'This is message',
  })
  textInputHtml: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Text Input HTML Readonly',
    isDebug: true,
    required: true,
    type: FieldTypes.HTML,
    readonly: true,
    value: '<p>Hallo! From Html Readonly</p>',
    messages: 'This is message readonly',
  })
  textInputHtmlReadonly: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Text Input Disabled',
    disabled: true,
    isDebug: true,
    value: 'Disabled',
  })
  textInputDisabled: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Text Input Readonly',
    readonly: true,
    isDebug: true,
    value: 'Readonly',
  })
  textInputReadonly: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Text Input Hidden',
    readonly: true,
    isDebug: true,
    value: 'Hidden',
    type: FieldTypes.Hidden,
  })
  textInputHidden: string;
}
