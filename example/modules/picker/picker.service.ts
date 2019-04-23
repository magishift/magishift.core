import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../../src/crud/crud.service';
import { DraftService } from '../../../src/crud/draft/draft.service';
import { IPicker, IPickerDto } from './interfaces/picker.interface';
import { Picker } from './picker.entity';
import { PickerMapper } from './picker.mapper';

@Injectable()
export class PickerService extends CrudService<IPicker, IPickerDto> {
  constructor(
    @InjectRepository(Picker) protected readonly PickerRepository: Repository<Picker>,
    protected readonly draftService: DraftService,
    protected readonly mapper: PickerMapper,
  ) {
    super(PickerRepository, draftService, mapper);
  }
}
