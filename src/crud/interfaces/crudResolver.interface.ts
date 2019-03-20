import { ICrudDto, ICrudEntity } from './crud.interface';

export interface ISubscriptionResult {
  subscribe: () => any;
}

export interface ICrudResolver<TDto extends ICrudDto, TEntity extends ICrudEntity> {
  findById(ctx: any): Promise<object>;

  findAll(ctx: any): Promise<object>;

  create(args: { input }): Promise<void>;

  updateById(args: { input }): Promise<void>;

  update(args: { input }): Promise<void>;

  destroy(ctx: any): Promise<void>;

  destroyById(ctx: any): Promise<object>;

  created(ctx: any): ISubscriptionResult;

  updated(): ISubscriptionResult;

  destroyed(): ISubscriptionResult;
}
