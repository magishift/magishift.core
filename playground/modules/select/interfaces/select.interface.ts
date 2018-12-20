import { ICrudDto, ICrudEntity } from '../../../../src/crud/interfaces/crud.interface';

export interface ISelect extends ICrudEntity {
  data: string;
}
export interface ISelectDto extends ICrudDto {
  selectDisabled: string;
  selectReadonly: string;
  select: string;
  selectRequired: string;
}
