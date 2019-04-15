import { ICrudDto } from './interfaces/crud.interface';
import {
  FieldTypes,
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
  IFormFieldTextArea,
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

export const Form = (param: { type?: FormTypes } = { type: FormTypes.Simple }): any => {
  return (target: { name: string; prototype: ICrudDto }) => {
    const { type } = param;

    const formSchema: IForm = {
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
    | IFormFieldTextArea
    | IFormFieldUpload
    | IFormFieldAutocomplete
    | IFormFieldSelect
    | IFormFieldCheckbox
    | IFormFieldCheckboxes
    | IFormFieldButton
    | IFormFieldRadio
    | IFormFieldTable
    | IFormFieldFk,
): any => /* Resolve form field*/ (target: ICrudDto, key: string) => {
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

export const FormFieldTextArea = (arg: IFormFieldTextArea): any => {
  arg.type = FieldTypes.Textarea;
  return FormField(arg);
};

export const FormFieldUpload = (arg: IFormFieldUpload): any => {
  return FormField(arg);
};

export const FormFieldAutocomplete = (arg: IFormFieldAutocomplete): any => {
  arg.type = FieldTypes.Autocomplete;

  return FormField(arg);
};

export const FormFieldSelect = (arg: IFormFieldSelect): any => {
  arg.type = FieldTypes.Select;

  return FormField(arg);
};
export const FormFieldCheckbox = (arg: IFormFieldCheckbox): any => {
  arg.type = FieldTypes.Checkbox;

  return FormField(arg);
};
export const FormFieldCheckboxes = (arg: IFormFieldCheckboxes): any => {
  arg.type = FieldTypes.Checkboxes;

  return FormField(arg);
};
export const FormFieldButton = (arg: IFormFieldButton): any => {
  arg.type = FieldTypes.ButtonCallback;

  return FormField(arg);
};
export const FormFieldRadio = (arg: IFormFieldRadio): any => {
  arg.type = FieldTypes.Radio;

  return FormField(arg);
};
export const FormFieldTable = (arg: IFormFieldTable): any => {
  arg.type = FieldTypes.Table;

  return FormField(arg);
};
export const FormFieldFk = (arg: IFormFieldFk): any => {
  arg.type = FieldTypes.Fk;

  return FormField(arg);
};
