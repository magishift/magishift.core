import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/role.const';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { AutocompleteMapper } from './autocomplete.mapper';
import { AutocompleteService } from './autocomplete.service';
import { AUTOCOMPLETE_ENDPOINT } from './interfaces/autocomplete.const';
import { IAutocomplete, IAutocompleteDto } from './interfaces/autocomplete.interface';

@Controller(AUTOCOMPLETE_ENDPOINT)
export class AutocompleteController extends CrudControllerFactory<IAutocompleteDto, IAutocomplete>(
  AUTOCOMPLETE_ENDPOINT,
  {
    default: [DefaultRoles.admin],
  },
) {
  constructor(readonly autocompleteService: AutocompleteService, protected readonly mapper: AutocompleteMapper) {
    super(autocompleteService, mapper);
  }
}
