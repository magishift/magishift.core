export interface IFilterDraft {
  offset?: number;
  where?: Partial<any>;
  whereOr?: Partial<any>;
  order?: string[];
  limit?: number;
}
