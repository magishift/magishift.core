import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import jwt = require('jsonwebtoken');
import { ITokenPayload } from './interfaces/auth.interface';
import { KeycloakService } from './keycloak/keycloak.service';
import { LoginHistoryService } from './loginHistory/loginHistory.service';
import { DefaultRoles } from './role/defaultRoles';
import { SessionUtil } from './session.util';

@Injectable()
export class AuthService {
  private static keycloakAdminService: KeycloakService;
  private static loginHistoryService: LoginHistoryService;

  constructor(
    private readonly keycloakAdminService: KeycloakService,
    private readonly loginHistoryService: LoginHistoryService,
  ) {
    AuthService.keycloakAdminService = this.keycloakAdminService;
    AuthService.loginHistoryService = this.loginHistoryService;
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
        const decryptedToken: ITokenPayload = jwt.decode(jwtToken) as ITokenPayload;

        if (!decryptedToken) {
          throw new HttpException('Invalid JWT token', 400);
        }

        await AuthService.keycloakAdminService.verifyToken(jwtToken, realm);

        SessionUtil.setCurrentToken = jwtToken;
        SessionUtil.setAccountId = decryptedToken.sub;
        SessionUtil.setAccountRoles = decryptedToken.realm_access
          ? [...decryptedToken.realm_access.roles, DefaultRoles.authenticated]
          : [];

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
      throw new HttpException(e, e.status || HttpStatus.UNAUTHORIZED);
    }
  }
}
