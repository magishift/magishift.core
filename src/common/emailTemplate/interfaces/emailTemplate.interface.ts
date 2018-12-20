import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';

export interface IEmailTemplate extends ICrudEntity {
  type: string;
  subject: string;
  template: string;
}

export interface IEmailTemplateDto extends ICrudDto {
  type: string;
  subject: string;
  template: string;
}
