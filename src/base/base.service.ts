import { Repository } from 'typeorm';
import { IBaseEntity } from './interfaces/base.interface';

export abstract class BaseService<TEntity extends IBaseEntity> {
  constructor(protected readonly repository: Repository<TEntity>, protected readonly softDelete: boolean = true) {}
}
