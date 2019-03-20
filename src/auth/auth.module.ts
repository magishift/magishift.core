import { Global, Module } from '@nestjs/common';
import { HttpModule } from '../http/http.module';
import { AuthService } from './auth.service';
import { KeycloakController } from './keycloak/keycloak.controller';
import { KeyCloakService } from './keycloak/keycloak.service';
import { KeycloakAdminService } from './keycloak/keycloakAdmin.service';
import { LoginHistoryModule } from './loginHistory/loginHistory.module';

@Global()
@Module({
  controllers: [KeycloakController],
  imports: [LoginHistoryModule, HttpModule],
  providers: [AuthService, KeyCloakService, KeycloakAdminService],
  exports: [AuthService, LoginHistoryModule],
})
export class AuthModule {}
