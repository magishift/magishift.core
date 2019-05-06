import { IBaseDto } from '@magishift/base';

export interface IDraft {
  id: string;
  service: string;
  data: IBaseDto;
}
