import { CrudMapper } from '../../crud/crud.mapper';
import { ISmsTemplate, ISmsTemplateDto } from './interfaces/smsTemplate.interface';
import { SmsTemplateDto } from './smsTemplate.dto';
import { SmsTemplate } from './smsTemplate.entity';

export class SmsTemplateMapper extends CrudMapper<ISmsTemplate, ISmsTemplateDto> {
  constructor() {
    super(SmsTemplate, SmsTemplateDto);
  }
}
