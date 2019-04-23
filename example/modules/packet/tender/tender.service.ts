import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../../../src/crud/crud.service';
import { DraftService } from '../../../../src/crud/draft/draft.service';
import { ITender, ITenderDto } from './interfaces/tender.interface';
import { Tender } from './tender.entity';
import { TenderMapper } from './tender.mapper';

@Injectable()
export class TenderService extends CrudService<ITender, ITenderDto> {
  constructor(
    @InjectRepository(Tender) protected readonly repository: Repository<Tender>,
    protected readonly mapper: TenderMapper,
    protected readonly draftService: DraftService,
  ) {
    super(repository, draftService, mapper);
  }
}
