import { DynamicModule, Global, Module } from '@nestjs/common';
import { createAsyncClientOptions, createClient } from './redis-client.provider';
import { REDIS_MODULE_OPTIONS } from './redis.constants';
import { IRedisModuleAsyncOptions, IRedisModuleOptions } from './redis.interface';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisCoreModule {
  static register(options: IRedisModuleOptions | IRedisModuleOptions[]): DynamicModule {
    return {
      module: RedisCoreModule,
      providers: [createClient(), { provide: REDIS_MODULE_OPTIONS, useValue: options }],
      exports: [RedisService],
    };
  }

  static forRootAsync(options: IRedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisCoreModule,
      imports: options.imports,
      providers: [createClient(), createAsyncClientOptions(options)],
      exports: [RedisService],
    };
  }
}
