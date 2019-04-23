import { ICrudDto, ICrudEntity } from '../../../../src/crud/interfaces/crud.interface';

export interface IAutocomplete extends ICrudEntity {
  data: string;
}
export interface IAutocompleteDto extends ICrudDto {
  autocompleteDisabled: string;
  autocompleteReadonly: string;
  autocomplete: string;
  autocompleteRequired: string;
}
