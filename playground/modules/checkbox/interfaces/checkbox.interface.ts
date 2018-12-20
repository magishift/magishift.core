import { ICrudDto, ICrudEntity } from '../../../../src/crud/interfaces/crud.interface';

export interface ICheckbox extends ICrudEntity {
  data: string;
}
export interface ICheckboxDto extends ICrudDto {
  checkbox: string;
  checkboxDisabled: string;
  checkboxReadonly: string;
}
