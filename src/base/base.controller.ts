import { BaseService } from './base.service';
import { IBaseEntity } from './interfaces/base.interface';

export abstract class BaseController<TEntity extends IBaseEntity> {
  constructor(protected readonly service: BaseService<TEntity>) {}
}
