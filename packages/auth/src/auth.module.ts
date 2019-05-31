import { HttpModule } from '@magishift/http';
import { KeycloakController, KeycloakService } from '@magishift/keycloak';
import { RedisModule } from '@magishift/redis';
import { Global, Module } from '@nestjs/common';

import { AuthService } from './auth.service';

@Global()
@Module({
  controllers: [KeycloakController],
  imports: [HttpModule, RedisModule],
  providers: [AuthService, KeycloakService],
  exports: [AuthService],
})
export class AuthModule {}
