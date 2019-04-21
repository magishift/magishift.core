import { ICrudDto } from './interfaces/crud.interface';
import {
  ColumnAlign,
  ColumnTypes,
  IFilterOptions,
  IGrid,
  IGridColumn,
  IGridColumns,
  IGridFilters,
  IGridOptions,
  IGridSchemas,
} from './interfaces/grid.interface';

const gridColumnRegistries: { [key: string]: IGridColumns } = {};

const gridFilterRegistries: IGridFilters = {};

export const GridSchemaRegistries: IGridSchemas = {};

export const Grid = (
  param: {
    options?: IGridOptions;
    filters?: IFilterOptions;
  } = {},
) => {
  let { options, filters } = param;

  options = Object.assign(
    {
      create: true,
      update: true,
      delete: true,
      view: true,
    },
    options,
  );

  filters = filters || {
    model: {},
    fields: {},
    rules: {},
  };

  return (target: { name: string; prototype: ICrudDto }) => {
    const targetName = target.name;

    const superClass = Object.getPrototypeOf(target);

    if (superClass && superClass.name !== targetName && gridColumnRegistries[superClass.name]) {
      gridColumnRegistries[targetName] = {
        ...gridColumnRegistries[targetName],
        ...gridColumnRegistries[superClass.name],
      };
    }

    const gridSchema: IGrid = {
      options,
      filters: gridFilterRegistries[target.name] || filters,
      columns: gridColumnRegistries[target.name],
      foreignKey: {},
    };

    target.prototype.gridSchema = gridSchema;

    GridSchemaRegistries[target.name] = gridSchema;
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

  return (target: { gridColumns: IGridColumns; gridFilters: IGridFilters }, key: string) => {
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
        const filters: IFilterOptions = {
          rules: {},
          fields: {},
          model: {},
        };

        gridFilterRegistries[targetName] = filters;
      }

      gridFilterRegistries[targetName].fields[key] = {
        label: text,
        type,
      };
    }
  };
};
