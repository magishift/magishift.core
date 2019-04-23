import { ApiModelProperty } from '@nestjs/swagger';

export enum ColumnTypes {
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
  Map = 'map',
  Number = 'number',
  Image = 'image',
  File = 'file',
  Checkbox = 'checkbox',
  Checkboxes = 'checkBoxes',
  Radio = 'radio',
  HTML = 'html',
  Info = 'info',
  Boolean = 'boolean',
  String = 'string',
}

export enum ColumnAlign {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export interface IGridColumn {
  text: string;
  type?: ColumnTypes;
  align?: ColumnAlign;
  searchAble?: boolean;
  value?: string;
}

export interface IGridColumns {
  [key: string]: IGridColumn;
}

export interface ICustomGridAction {
  type: 'form' | 'grid' | 'action';
  icon: string;
  formUrl?: string;
  gridUrl?: string;
  action: string;
}

export interface IGridOptions {
  readonly create?: boolean;
  readonly update?: boolean;
  readonly delete?: boolean;
  readonly view?: boolean;
  readonly custom?: ICustomGridAction;
  readonly customs?: ICustomGridAction[];
  readonly softDelete?: boolean;
}

export interface IFilterOptions {
  readonly model: object;
  readonly fields: object;
  readonly rules: object;
}

export interface IGrid {
  options: IGridOptions;
  filters: IFilterOptions;
  columns: IGridColumns;
  foreignKey: { [key: string]: string };
}

export interface IGridSchemas {
  [key: string]: IGrid;
}

export interface IGridSchema {
  schema: IGrid;
}

class SwaggerGrid implements IGrid {
  @ApiModelProperty()
  options: IGridOptions;

  @ApiModelProperty()
  filters: IFilterOptions;

  @ApiModelProperty()
  columns: IGridColumns;

  @ApiModelProperty()
  foreignKey: { [key: string]: string };
}

export class SwaggerGridSchema implements IGridSchema {
  @ApiModelProperty()
  schema: SwaggerGrid;
}
