import { ICrudDto, ICrudEntity } from '../../crud/interfaces/crud.interface';

export interface IReport extends ICrudEntity {
  index: number;
  url: string;
  authorization: string;
  method: 'GET' | 'POST';
}

export interface IReportDto extends ICrudDto {
  index: number;
  url: string;
  authorization: string;
  method: 'GET' | 'POST';
}
