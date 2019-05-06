import { HttpModule } from '@magishift/http';
import { IRedisModuleOptions, RedisModule } from '@magishift/redis';
import { Global, Module } from '@nestjs/common';
import { KeycloakController } from './keycloak.controller';
import { KeycloakService } from './keycloak.service';

const redisConfig: IRedisModuleOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

@Global()
@Module({
  controllers: [KeycloakController],
  imports: [HttpModule, RedisModule.register(redisConfig)],
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule {}
