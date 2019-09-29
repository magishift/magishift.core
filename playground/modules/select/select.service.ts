import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../../src/crud/crud.service';
import { DraftService } from '../../../src/crud/draft/draft.service';
import { ISelect, ISelectDto } from './interfaces/select.interface';
import { Select } from './select.entity';
import { SelectMapper } from './select.mapper';

@Injectable()
export class SelectService extends CrudService<ISelect, ISelectDto> {
  constructor(
    @InjectRepository(Select) protected readonly SelectRepository: Repository<ISelect>,
    protected readonly draftService: DraftService,
    protected readonly mapper: SelectMapper,
  ) {
    super(SelectRepository, draftService, mapper);
  }
}
