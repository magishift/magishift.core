import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../auth/role/role.const';
import { CrudControllerFactory } from '../../crud/crud.controller';
import { SMS_TEMPLATE_ENDPOINT } from './interfaces/smsTemplate.const';
import { ISmsTemplate, ISmsTemplateDto } from './interfaces/smsTemplate.interface';
import { SmsTemplateMapper } from './smsTemplate.mapper';
import { SmsTemplateService } from './smsTemplate.service';

@Controller(SMS_TEMPLATE_ENDPOINT)
export class SmsTemplateController extends CrudControllerFactory<ISmsTemplateDto, ISmsTemplate>(SMS_TEMPLATE_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(protected readonly smsTemplateService: SmsTemplateService, protected readonly mapper: SmsTemplateMapper) {
    super(smsTemplateService, mapper);
  }
}
