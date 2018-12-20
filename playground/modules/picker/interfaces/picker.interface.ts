import { ICrudDto, ICrudEntity } from '../../../../src/crud/interfaces/crud.interface';

export interface IPicker extends ICrudEntity {
  data: string;
}
export interface IPickerDto extends ICrudDto {
  dateTime: Date;
  date: Date;
  time: Date;
  dateTimeDisabled: Date;
  dateTimeReadonly: Date;
}
