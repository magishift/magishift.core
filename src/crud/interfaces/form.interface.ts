export enum FieldTypes {
  Text = 'text',
  Textarea = 'textarea',
  Select = 'select',
  Autocomplete = 'autocomplete',
  Email = 'email',
  Password = 'password',
  Date = 'date',
  Time = 'time',
  Datetime = 'datetime',
  Money = 'money',
  Table = 'table',
  Fk = 'fk',
  Map = 'map',
  Number = 'number',
  Automatic = 'automatic',
  Image = 'image',
  File = 'file',
  CSV = 'csv',
  Checkbox = 'checkbox',
  Checkboxes = 'checkboxes',
  Radio = 'radio',
  HTML = 'html',
  Hidden = 'hidden',
  Info = 'info',
  ButtonCallback = 'buttonCallback',
}

export enum FieldModes {
  Create = 'isCreate',
  Edit = 'isEdit',
  View = 'isView',
}

export enum FormTypes {
  Simple = 'simple',
  Wizard = 'wizard',
}

export interface IForm {
  inline: boolean;
  model: object;
  fields: {
    [name: string]:
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
  type?: FormTypes;
}

export interface IOptionalsOn {
  property: string;
  value?: string | object | boolean;
  valueNot?: string | object | boolean;
  greaterThan?: number;
  lessThan?: number;
  operator?: 'and' | 'or';
}

export declare type IObjectType<T> = new () => T;

export interface IFormField {
  label: string;
  type?: FieldTypes;
  required?: boolean;
  mode?: FieldModes;
  readonly?: boolean;
  disabled?: boolean;
  optionalsOn?: IOptionalsOn[];
  group?: string;
  wizardStep?: {
    title: string;
    order: number;
  };
  isFullWidth?: boolean;
  watch?: string[];
  messages?: string | string[];
  isDebug?: boolean;
  callBack?: string;
  value?: any;
  multiple?: boolean;
}

export interface IFormFieldUpload extends IFormField {
  type: FieldTypes.Image | FieldTypes.File;
  uploadUrl: string;
  maxFiles?: number;
  maxFileSize?: number;
  ownerId?: string;
}

export interface IFormFieldSelect extends IFormField {
  type: FieldTypes.Select;
  choices: string[] | object[];
}

export interface IFormFieldAutocomplete extends IFormField {
  type: FieldTypes.Autocomplete;
  dataSource: IAutocompleteDataSource;
  showTopRecord: boolean | number;
}

export interface IFormFieldButton extends IFormField {
  type: FieldTypes.ButtonCallback;
  actionUrl: string;
}

export interface IFormFieldCheckbox extends IFormField {
  type: FieldTypes.Checkbox;
}

export interface IFormFieldCheckboxes extends IFormField {
  type: FieldTypes.Checkboxes;
  choices: { [key: string]: any };
}

export interface IFormFieldRadio extends IFormField {
  type: FieldTypes.Radio;
  choices: { value: string; text: string }[];
}

export interface IFormFieldTable extends IFormField {
  type: FieldTypes.Table;
  fk?: { [key: string]: string };
  model?: string;
  data?: object[];
}

export interface IFormFieldFk extends IFormField {
  type: FieldTypes.Fk;
  fk?: { [key: string]: string };
}

export interface IAutocompleteDataSource {
  url: string;
  searchParams: string[];
  filterBy?: { [name: string]: string };
}

export interface IFormSchema {
  schema: IForm;
}
