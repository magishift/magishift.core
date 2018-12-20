import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';

export interface ISmsTemplate extends ICrudEntity {
  type: string;
  template: string;
}

export interface ISmsTemplateDto extends ICrudDto {
  type: string;
  template: string;
}
