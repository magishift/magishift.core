import { ICrudDto, ICrudEntity } from '../../../../src/crud/interfaces/crud.interface';

export interface ITextInput extends ICrudEntity {
  data: string;
}
export interface ITextInputDto extends ICrudDto {
  textInputDisabled: string;
  textInputReadonly: string;
  textInput: string;
  textInputRequired: string;
  textInputWatch: string;
  textInputMoney: string;
  textInputCallback: string;
}
