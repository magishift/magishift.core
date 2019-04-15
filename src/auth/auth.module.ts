import { Global, Module } from '@nestjs/common';
import { RedisModule } from '../database/redis/redis.module';
import { HttpModule } from '../http/http.module';
import { AuthService } from './auth.service';
import { KeycloakController } from './keycloak/keycloak.controller';
import { KeycloakService } from './keycloak/keycloak.service';
import { LoginHistoryModule } from './loginHistory/loginHistory.module';

@Global()
@Module({
  controllers: [KeycloakController],
  imports: [LoginHistoryModule, HttpModule, RedisModule],
  providers: [AuthService, KeycloakService],
  exports: [AuthService, LoginHistoryModule],
})
export class AuthModule {}
