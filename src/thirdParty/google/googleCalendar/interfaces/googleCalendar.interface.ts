import { ICrudDto, ICrudEntity } from '../../../../crud/interfaces/crud.interface';

export interface IGoogleCalendar extends ICrudEntity {
  type: string;
  template: string;
}

export interface IGoogleCalendarDto extends ICrudDto {
  type: string;
  template: string;
}
