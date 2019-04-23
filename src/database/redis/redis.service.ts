import { Inject, Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import { IRedisClient, RedisClientError } from './redis-client.provider';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: IRedisClient) {}

  getClient(name?: string): Redis.Redis {
    if (!name) {
      name = this.redisClient.defaultKey;
    }
    if (!this.redisClient.clients.has(name)) {
      throw new RedisClientError(`client ${name} is not exists`);
    }
    return this.redisClient.clients.get(name);
  }
}
