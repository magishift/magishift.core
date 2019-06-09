import { IFieldData, IFormField } from '@/interfaces/form.interface';

export default interface IField {
  label: string;
  isEdit: boolean;
  field: IFormField;
  name: string;
  readonly: boolean;
  disabled: boolean;
  isRequired: boolean;
  isReadonly: boolean;
  isDisabled: boolean;
  isReadonlyOrDisabled: boolean;
  value: string | IFieldData;
  model: string | IFieldData;
  validationRules: any[];
}
