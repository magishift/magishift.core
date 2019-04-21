import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../../src/crud/crud.mapper';
import { AutocompleteDto } from './autocomplete.dto';
import { Autocomplete } from './autocomplete.entity';
import { IAutocomplete, IAutocompleteDto } from './interfaces/autocomplete.interface';

@Injectable()
export class AutocompleteMapper extends CrudMapper<IAutocomplete, IAutocompleteDto> {
  constructor() {
    super(Autocomplete, AutocompleteDto);
  }
}
