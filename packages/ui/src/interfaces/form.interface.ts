export enum FieldTypes {
  Text = 'text',
  Textarea = 'textarea',
  Select = 'select',
  Email = 'email',
  Password = 'password',
  Date = 'date',
  Time = 'time',
  Datetime = 'datetime',
  Money = 'money',
  Table = 'table',
  Map = 'map',
  Number = 'number',
  Automatic = 'automatic',
  Image = 'image',
  File = 'file',
  Checkbox = 'checkbox',
  Csv = 'csv',
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
      | IFormFieldCheckbox
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

export interface IFormField {
  label: string;
  type: FieldTypes;
  required?: boolean | { create?: boolean; update?: boolean };
  mode?: FieldModes;
  readonly?: boolean;
  createOnly?: boolean;
  disabled?: boolean;
  optionalsOn?: IOptionalsOn[];
  group?: string;
  wizardStepTitle?: string;
  isFullWidth?: boolean;
  ownerId: string;
  watch: string[];
  callBack: string;
  value: any;
  choices: any[];
  dataSource: IFormDataSource;
  onUploading?: () => void;
  actionUrl: string;
  key: string;
  name: string;
  fk: { [key: string]: string };
  multiple: boolean;
}

export interface IFormFieldUpload extends IFormField {
  type: FieldTypes.Image | FieldTypes.File | FieldTypes.Csv;
  uploadUrl: string;
  multiple: boolean;
  maxFiles: number;
  maxFileSize: number;
}

export interface IFormFieldAutocomplete extends IFormField {
  type: FieldTypes.Select;
  dataSource: IFormDataSource;
  choices: object[];
}

export interface IFormFieldCheckbox extends IFormField {
  type: FieldTypes.Checkbox;
  choices: string[] | object[];
}

export interface IFormFieldTable extends IFormField {
  type: FieldTypes.Table;
  fk: { [key: string]: string };
  model: string;
}

export interface IFormFieldFk extends IFormField {
  fk: { [key: string]: string };
  model: string;
}

export interface IFormDataSource {
  url: string;
  searchParams: string[];
  filterBy: { [modelProperty: string]: string };
}

export interface IFormSchema {
  schema: IForm;
}

export interface IFieldData {
  id: string;
  [key: string]: any;
  isDeleted: boolean;
  _dataStatus: string;
  lastIndex: number;
  __meta: IDataMeta;
  fk: { [key: string]: string };
}

export interface IDataMeta {
  dataStatus?: string;
  editAble?: boolean;
  deleteAble?: boolean;
  dataOwner?: string;
  histories?: [];
}
