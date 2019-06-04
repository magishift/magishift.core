import { ICrudDto } from '../../interfaces/crud.interface';

export interface IDraft {
  id: string;
  service: string;
  data: ICrudDto;
}
