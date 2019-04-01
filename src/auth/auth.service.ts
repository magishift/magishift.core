import { HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { RedisService } from '../database/redis/redis.service';
import { ExceptionHandler } from '../utils/error.utils';
import { ITokenPayload } from './interfaces/auth.interface';
import { KeyCloakService } from './keycloak/keycloak.service';
import { KeycloakAdminService } from './keycloak/keycloakAdmin.service';
import { LoginHistoryService } from './loginHistory/loginHistory.service';
import { DefaultRoles } from './role/defaultRoles';
import { SessionUtil } from './session.util';

@Injectable()
export class AuthService {
  private static keycloakService: KeyCloakService;
  private static loginHistoryService: LoginHistoryService;

  constructor(
    protected readonly keycloakAdminService: KeycloakAdminService,
    protected readonly keycloakService: KeyCloakService,
    protected readonly loginHistoryService: LoginHistoryService,
    protected readonly redisService: RedisService,
  ) {
    AuthService.keycloakService = keycloakService;
    AuthService.loginHistoryService = loginHistoryService;
  }

  login(username: string, password: string, realm: string): any {
    return this.keycloakService.login(username, password, realm);
  }

  async logout(token: string, realm: string): Promise<void> {
    const authHeader = token.split(' ');

    await this.keycloakService.logout(authHeader[authHeader.length - 1], realm);
  }

  static async authorizeToken(
    jwtToken: string,
    operationName: string,
    realm: string,
    permissions: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<boolean> {
    try {
      const isPublic = !permissions || permissions.length === 0 || permissions.indexOf(DefaultRoles.public) >= 0;

      if (jwtToken !== undefined && jwtToken !== null && jwtToken !== DefaultRoles.public) {
        await AuthService.keycloakService.verifyToken(jwtToken, realm);

        const decryptedToken = jwt.decode(jwtToken) as ITokenPayload;

        SessionUtil.setCurrentToken = jwtToken;
        SessionUtil.setAccountId = decryptedToken.sub;
        SessionUtil.setAccountRealm = realm;
        SessionUtil.setAccountRoles = decryptedToken.realm_access
          ? decryptedToken.realm_access.roles
          : [DefaultRoles.authenticated];

        await AuthService.loginHistoryService.updateActions(
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
      return ExceptionHandler(e, e.status || HttpStatus.UNAUTHORIZED);
    }
  }
}
