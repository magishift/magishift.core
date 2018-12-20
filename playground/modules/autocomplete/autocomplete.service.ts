import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../../src/crud/crud.service';
import { DraftService } from '../../../src/crud/draft/draft.service';
import { Autocomplete } from './autocomplete.entity';
import { AutocompleteMapper } from './autocomplete.mapper';
import { IAutocomplete, IAutocompleteDto } from './interfaces/autocomplete.interface';

@Injectable()
export class AutocompleteService extends CrudService<IAutocomplete, IAutocompleteDto> {
  constructor(
    @InjectRepository(Autocomplete) protected readonly AutocompleteRepository: Repository<Autocomplete>,
    protected readonly draftService: DraftService,
    protected readonly mapper: AutocompleteMapper,
  ) {
    super(AutocompleteRepository, draftService, mapper);
  }
}
