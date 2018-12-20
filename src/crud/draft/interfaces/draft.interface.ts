import { IBaseDto } from '../../../base/interfaces/base.interface';

export interface IDraft {
  id: string;
  service: string;
  data: IBaseDto;
}
