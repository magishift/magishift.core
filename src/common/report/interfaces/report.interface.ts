import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';

export interface IReport extends ICrudEntity {
  index: number;
  title: string;
  url: string;
  authorization: string;
  method: 'GET' | 'POST';
}

export interface IReportDto extends ICrudDto {
  index: number;
  title: string;
  url: string;
  authorization: string;
  method: 'GET' | 'POST';
}
