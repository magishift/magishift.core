import { ICrudDto, ICrudEntity } from './crud.interface';

export interface ISubscriptionResult {
  subscribe: () => any;
}

export interface ICrudResolver<TDto extends ICrudDto, TEntity extends ICrudEntity> {
  findById(ctx: any): Promise<object>;

  findAll(ctx: any): Promise<object>;

  create(args: { input }): Promise<object>;

  updateById(args: { input }): Promise<object>;

  update(args: { input }): Promise<object>;

  destroy(ctx: any): Promise<object>;

  destroyById(ctx: any): Promise<object>;

  created(ctx: any): ISubscriptionResult;

  updated(): ISubscriptionResult;

  destroyed(): ISubscriptionResult;
}
