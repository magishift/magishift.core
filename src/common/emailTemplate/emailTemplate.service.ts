import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../crud/crud.service';
import { DraftService } from '../../crud/draft/draft.service';
import { EmailTemplate } from './emailTemplate.entity';
import { EmailTemplateMapper } from './emailTemplate.mapper';
import { IEmailTemplate, IEmailTemplateDto } from './interfaces/emailTemplate.interface';

@Injectable()
export class EmailTemplateService extends CrudService<IEmailTemplate, IEmailTemplateDto> {
  constructor(
    @InjectRepository(EmailTemplate) protected readonly emailTemplateRepository: Repository<IEmailTemplate>,
    protected readonly draftService: DraftService,
    protected readonly mapper: EmailTemplateMapper,
  ) {
    super(emailTemplateRepository, draftService, mapper);
  }

  async findByType(type: string): Promise<IEmailTemplateDto> {
    const data = await this.emailTemplateRepository.findOne({ type });

    return this.mapper.entityToDto(data);
  }
}
