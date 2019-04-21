import { ICrudDto } from './interfaces/crud.interface';
import {
  ColumnAlign,
  ColumnTypes,
  IFilterOptions,
  IGrid,
  IGridColumn,
  IGridColumns,
  IGridOptions,
  IGridSchemas,
} from './interfaces/grid.interface';

const gridColumnRegistries: { [key: string]: IGridColumns } = {};

const gridFilterRegistries: { [key: string]: IFilterOptions } = {};

export const GridSchemaRegistries: IGridSchemas = {};

export const Grid = (
  param: {
    options?: IGridOptions;
  } = {},
) => {
  let { options } = param;

  options = Object.assign(
    {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    options,
  );

  return (target: { name: string; prototype: ICrudDto }) => {
    const targetName = target.name;

    const superClass = Object.getPrototypeOf(target);

    if (superClass && superClass.name !== targetName && gridColumnRegistries[superClass.name]) {
      gridColumnRegistries[targetName] = Object.assign(
        gridColumnRegistries[superClass.name],
        gridColumnRegistries[targetName],
      );

      gridFilterRegistries[targetName] = Object.assign(
        gridFilterRegistries[superClass.name],
        gridFilterRegistries[targetName],
      );
    }

    const gridSchema: IGrid = {
      options,
      filters: gridFilterRegistries[targetName],
      columns: gridColumnRegistries[targetName],
      foreignKey: {},
    };

    target.prototype.gridSchema = gridSchema;

    GridSchemaRegistries[targetName] = gridSchema;
  };
};

export const GridColumn = (arg: string | IGridColumn) => {
  let text: string;
  let value: string;

  let type = ColumnTypes.String;
  let align = ColumnAlign.Left;
  let searchAble = false;

  if (typeof arg === 'string') {
    text = arg;
  } else {
    const column = arg as IGridColumn;
    text = column.text;
    type = column.type || type;
    align = column.align || align;
    searchAble = column.searchAble || searchAble;
    value = column.value;
  }

  return (target: { gridColumns: IGridColumns }, key: string) => {
    const targetName = target.constructor.name;

    if (!gridColumnRegistries[targetName]) {
      gridColumnRegistries[targetName] = {};
    }

    gridColumnRegistries[targetName][key] = {
      text,
      value: value || key,
      type: type || ColumnTypes.String,
      align: align || ColumnAlign.Left,
    };

    if (searchAble) {
      if (!gridFilterRegistries[targetName]) {
        gridFilterRegistries[targetName] = {
          rules: {},
          fields: {},
          model: {},
        };
      }

      gridFilterRegistries[targetName].fields[key] = {
        label: text,
        type,
      };
    }
  };
};
