import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../auth/role/defaultRoles';
import { CrudControllerFactory } from '../../crud/crud.controller';
import { EmailTemplateDto } from './emailTemplate.dto';
import { EmailTemplateMapper } from './emailTemplate.mapper';
import { EmailTemplateService } from './emailTemplate.service';
import { EMAIL_TEMPLATE_ENDPOINT } from './interfaces/emailTemplate.const';
import { IEmailTemplate, IEmailTemplateDto } from './interfaces/emailTemplate.interface';

@Controller(EMAIL_TEMPLATE_ENDPOINT)
export class EmailTemplateController extends CrudControllerFactory<IEmailTemplateDto, IEmailTemplate>(
  EMAIL_TEMPLATE_ENDPOINT,
  EmailTemplateDto,
  {
    default: [DefaultRoles.admin],
  },
) {
  constructor(
    protected readonly emailTemplateService: EmailTemplateService,
    protected readonly mapper: EmailTemplateMapper,
  ) {
    super(emailTemplateService, mapper);
  }
}
