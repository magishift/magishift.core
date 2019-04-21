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

const formFieldRegistries: {
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

export const FormSchemaRegistries: { [key: string]: IForm } = {};

export const Form = (param: { type?: FormTypes } = { type: FormTypes.Simple }): any => {
  return (target: { name: string; prototype: ICrudDto }) => {
    const { type } = param;

    const targetName: string = target.name;

    const superClass = Object.getPrototypeOf(target);

    if (superClass && superClass.name !== targetName && formFieldRegistries[superClass.name]) {
      formFieldRegistries[targetName] = {
        ...formFieldRegistries[targetName],
        ...formFieldRegistries[superClass.name],
      };
    }

    const formSchema: IForm = {
      fields: formFieldRegistries[target.name],
      type,
    };

    target.prototype.formSchema = formSchema;

    FormSchemaRegistries[target.name] = formSchema;
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
): any => (target: ICrudDto, key: string) => {
  const targetName: string = target.constructor.name;

  // Check if dto with given name already in formFields
  if (!formFieldRegistries[targetName]) {
    formFieldRegistries[targetName] = {};
  }

  if (typeof arg === 'string') {
    formFieldRegistries[targetName][key] = {
      label: arg,
    };
  } else {
    formFieldRegistries[targetName][key] = arg;
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
