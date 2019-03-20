import { ICrudDto } from './interfaces/crud.interface';
import {
  FormTypes,
  IForm,
  IFormField,
  IFormFieldAutocomplete,
  IFormFieldButton,
  IFormFieldCheckbox,
  IFormFieldCheckboxes,
  IFormFieldFk,
  IFormFieldRadio,
  IFormFieldSelect,
  IFormFieldTable,
  IFormFieldUpload,
} from './interfaces/form.interface';

const formFields: {
  [key: string]: {
    [key: string]:
      | IFormField
      | IFormFieldUpload
      | IFormFieldAutocomplete
      | IFormFieldSelect
      | IFormFieldCheckbox
      | IFormFieldCheckboxes
      | IFormFieldButton
      | IFormFieldRadio
      | IFormFieldTable
      | IFormFieldFk;
  };
} = {};

export const FormSchemas: { [key: string]: IForm } = {};

export const Form = (
  param: { inline?: boolean; type?: FormTypes } = { inline: false, type: FormTypes.Simple },
): any => {
  return (target: { name: string; prototype: ICrudDto }) => {
    const { inline, type } = param;

    const formSchema: IForm = {
      inline,
      model: {},
      fields: formFields[target.name],
      type,
    };

    FormSchemas[target.name] = formSchema;
  };
};

export const FormField = (
  arg:
    | string
    | IFormField
    | IFormFieldUpload
    | IFormFieldAutocomplete
    | IFormFieldSelect
    | IFormFieldCheckbox
    | IFormFieldCheckboxes
    | IFormFieldButton
    | IFormFieldRadio
    | IFormFieldTable
    | IFormFieldFk,
): any => {
  // Resolve form field
  return (target: ICrudDto, key: string) => {
    // Check if dto name already in formFields
    if (!formFields[target.constructor.name]) {
      formFields[target.constructor.name] = {};
    }

    if (typeof arg === 'string') {
      formFields[target.constructor.name][key] = {
        label: arg,
      };
    } else {
      formFields[target.constructor.name][key] = arg;
    }
  };
};
