import { CrudDto } from '../crud.dto';

export interface IFilter {
  offset?: number;
  where?: {
    [key: string]: {
      plain: string;
      regex: string;
    };
  };
  whereOr?: object;
  order?: string[];
  limit?: number;
  isShowDeleted?: boolean;
  relations?: string[];
  operator?: string;
}

export interface IFindAll<TEntity extends CrudDto> {
  count: number;

  data: TEntity[];
}
