import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { RedisService } from 'nestjs-redis';
import { ExceptionHandler } from '../utils/error.utils';
import { ITokenPayload } from './interfaces/auth.interface';
import { KeyCloakService } from './keycloak/keycloak.service';
import { KeycloakAdminService } from './keycloak/keycloakAdmin.service';
import { LoginHistoryService } from './loginHistory/loginHistory.service';
import { DefaultRoles } from './role/role.const';
import { SessionUtil } from './session.util';

@Injectable()
export class AuthService {
  constructor(
    protected readonly keycloakAdminService: KeycloakAdminService,
    protected readonly keycloakService: KeyCloakService,
    protected readonly loginHistoryService: LoginHistoryService,
    protected readonly redisService: RedisService,
  ) {}

  login(username: string, password: string): any {
    return this.keycloakService.login(username, password);
  }

  async logout(token: string): Promise<void> {
    const authHeader = token.split(' ');

    await this.keycloakService.logout(authHeader[authHeader.length - 1]);
  }

  async authorizeToken(
    jwtToken: string,
    operationName: string,
    permissions: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<boolean> {
    try {
      const isPublic = !permissions || permissions.length === 0 || permissions.indexOf(DefaultRoles.public) >= 0;

      if (jwtToken !== undefined && jwtToken !== null && jwtToken !== DefaultRoles.public) {
        await this.keycloakService.verifyToken(jwtToken);

        const decryptedToken = jwt.decode(jwtToken) as ITokenPayload;

        SessionUtil.setAccountId = decryptedToken.sub;
        SessionUtil.setAccountRealm = decryptedToken.azp;
        SessionUtil.setAccountRoles = decryptedToken.realm_access.roles;

        await this.loginHistoryService.updateActions(
          SessionUtil.setAccountId,
          decryptedToken.session_state,
          operationName,
        );

        if (!isPublic) {
          if (permissions.indexOf(DefaultRoles.authenticated) >= 0) {
            return true;
          }

          const result = decryptedToken.realm_access.roles.some(role => permissions.indexOf(role) >= 0);

          if (!result && permissions.indexOf(DefaultRoles.owner) >= 0) {
            return true;
          }

          return result;
        }
      }

      return isPublic;
    } catch (e) {
      return ExceptionHandler(e, 401);
    }
  }
}
