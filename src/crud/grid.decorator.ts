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

const gridColumns: { [key: string]: IGridColumns } = {};

const gridFilters: IGridFilters = {};

export const GridSchemas: IGridSchemas = {};

export const Grid = (
  param: {
    options?: IGridOptions;
    filters?: IFilterOptions;
    foreignKey?: { [key: string]: string };
  } = {},
) => {
  const { foreignKey } = param;
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

  return (target: { name }) => {
    const schema: IGrid = {
      options,
      filters: gridFilters[target.name] || filters,
      columns: gridColumns[target.name],
      foreignKey,
    };

    GridSchemas[target.name] = schema;
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
    const name = target.constructor.name;
    if (!gridColumns[name]) {
      gridColumns[name] = {};
    }

    gridColumns[name][key] = {
      text,
      value: value || key,
      type: type || ColumnTypes.String,
      align: align || ColumnAlign.Left,
    };

    if (searchAble) {
      if (!gridFilters[name]) {
        const filters: IFilterOptions = {
          rules: {},
          fields: {},
          model: {},
        };

        gridFilters[name] = filters;
      }

      gridFilters[name].fields[key] = {
        label: text,
        type,
      };
    }
  };
};
