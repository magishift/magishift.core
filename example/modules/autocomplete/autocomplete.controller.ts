import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { AutocompleteDto } from './autocomplete.dto';
import { AutocompleteMapper } from './autocomplete.mapper';
import { AutocompleteService } from './autocomplete.service';
import { AUTOCOMPLETE_ENDPOINT } from './interfaces/autocomplete.const';
import { IAutocomplete, IAutocompleteDto } from './interfaces/autocomplete.interface';

@Controller(AUTOCOMPLETE_ENDPOINT)
export class AutocompleteController extends CrudControllerFactory<IAutocompleteDto, IAutocomplete>(
  AUTOCOMPLETE_ENDPOINT,
  AutocompleteDto,
  {
    default: [DefaultRoles.admin],
  },
) {
  constructor(readonly autocompleteService: AutocompleteService, protected readonly mapper: AutocompleteMapper) {
    super(autocompleteService, mapper);
  }
}
