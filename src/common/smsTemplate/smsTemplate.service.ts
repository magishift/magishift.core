import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../crud/crud.service';
import { DraftService } from '../../crud/draft/draft.service';
import { ISmsTemplate, ISmsTemplateDto } from './interfaces/smsTemplate.interface';
import { SmsTemplate } from './smsTemplate.entity';
import { SmsTemplateMapper } from './smsTemplate.mapper';

@Injectable()
export class SmsTemplateService extends CrudService<ISmsTemplate, ISmsTemplateDto> {
  constructor(
    @InjectRepository(SmsTemplate) protected readonly smsTemplateRepository: Repository<SmsTemplate>,
    protected readonly draftService: DraftService,
    protected readonly mapper: SmsTemplateMapper,
  ) {
    super(smsTemplateRepository, draftService, mapper);
  }

  async findByType(type: string): Promise<ISmsTemplateDto> {
    const data = await this.smsTemplateRepository.findOne({ type });

    return this.mapper.entityToDto(data);
  }
}
