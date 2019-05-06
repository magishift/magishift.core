import { HttpModule } from '@magishift/http';
import { RedisModule } from '@magishift/redis';
import { Global, Module } from '@nestjs/common';
import { KeycloakController } from './keycloak.controller';
import { KeycloakService } from './keycloak.service';

@Global()
@Module({
  controllers: [KeycloakController],
  imports: [HttpModule, RedisModule],
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule {}
