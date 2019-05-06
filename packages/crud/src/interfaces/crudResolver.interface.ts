import { ICrudDto } from './crud.interface';
import { IFilter, IFindAllResult } from './filter.interface';

export interface ISubscriptionResult {
  subscribe: () => any;
}

export interface ICrudResolver<TDto extends ICrudDto> {
  findById(id: string): Promise<ICrudDto>;

  findAll(filter: IFilter): Promise<IFindAllResult>;

  create(args: TDto): Promise<void>;

  update(args: TDto): Promise<void>;

  destroy(args: TDto): Promise<void>;

  destroyById(args: string): Promise<void>;

  created(args: any): ISubscriptionResult;

  updated(): ISubscriptionResult;

  destroyed(): ISubscriptionResult;
}
