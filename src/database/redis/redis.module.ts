import { DynamicModule, Module } from '@nestjs/common';
import { IRedisModuleAsyncOptions, IRedisModuleOptions } from './redis.interface';

import { RedisCoreModule } from './redis-core.module';

@Module({})
export class RedisModule {
  static register(options: IRedisModuleOptions | IRedisModuleOptions[]): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.register(options)],
    };
  }

  static forRootAsync(options: IRedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRootAsync(options)],
    };
  }
}
