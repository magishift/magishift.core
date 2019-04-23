export interface IFilterWhere {
  [key: string]: {
    plain: string;
    regex: string;
  };
}

export interface IFilter {
  offset?: number;
  where?: Partial<any>;
  whereOr?: Partial<any>;
  order?: string[];
  limit?: number;
  isShowDeleted?: boolean;
  relations?: string[];
}

export interface IFindAllResult {
  totalCount: number;
  items: any[];
}
