import { CrudMapper } from '../../crud/crud.mapper';
import { EmailTemplateDto } from './emailTemplate.dto';
import { EmailTemplate } from './emailTemplate.entity';
import { IEmailTemplate, IEmailTemplateDto } from './interfaces/emailTemplate.interface';

export class EmailTemplateMapper extends CrudMapper<IEmailTemplate, IEmailTemplateDto> {
  constructor() {
    super(EmailTemplate, EmailTemplateDto);
  }
}
