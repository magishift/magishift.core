import { Repository } from 'typeorm';
import { IServiceConfig } from '../crud/interfaces/crudService.interface';
import { IBaseEntity } from './interfaces/base.interface';

export abstract class BaseService<TEntity extends IBaseEntity> {
  constructor(protected readonly repository: Repository<TEntity>, protected readonly config?: IServiceConfig) {}
}
