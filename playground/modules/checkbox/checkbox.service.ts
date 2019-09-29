import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../../src/crud/crud.service';
import { DraftService } from '../../../src/crud/draft/draft.service';
import { Checkbox } from './checkbox.entity';
import { CheckboxMapper } from './checkbox.mapper';
import { ICheckbox, ICheckboxDto } from './interfaces/checkbox.interface';

@Injectable()
export class CheckboxService extends CrudService<ICheckbox, ICheckboxDto> {
  constructor(
    @InjectRepository(Checkbox) protected readonly repository: Repository<ICheckbox>,
    protected readonly draftService: DraftService,
    protected readonly mapper: CheckboxMapper,
  ) {
    super(repository, draftService, mapper);
  }
}
