import { ModuleMetadata } from '@nestjs/common/interfaces';
import { RedisOptions } from 'ioredis';

export interface IRedisModuleOptions extends RedisOptions {
  name?: string;
}

export interface IRedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => IRedisModuleOptions | IRedisModuleOptions[] | Promise<IRedisModuleOptions> | Promise<IRedisModuleOptions[]>;
  inject?: any[];
}
