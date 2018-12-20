import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import * as lodash from 'lodash';
import { Repository } from 'typeorm';
import { ITokenPayload } from '../../auth/interfaces/auth.interface';
import { ExceptionHandler } from '../../utils/error.utils';
import { AuthService } from '../auth.service';
import { LoginHistoryService } from '../loginHistory/loginHistory.service';
import { Session } from '../session.entity';
import { SessionUtil } from '../session.util';
import { DefaultRoles } from './role.const';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
    private readonly loginHistoryService: LoginHistoryService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Get method or class permissions
      const permissions: string[] =
        this.reflector.get<string[]>('roles', context.getHandler()) ||
        this.reflector.get<string[]>('roles', context.getClass());

      const isPublic = !permissions || permissions.length === 0 || permissions.indexOf(DefaultRoles.public) >= 0;

      // Get request data
      const request = context.switchToHttp().getRequest();

      let authHeader: string[];

      if (request && request.headers && request.headers.authorization) {
        authHeader = request.headers.authorization.split(' ');
      } else {
        // if request doesn't exist use authScope
        const authScope = lodash.find(context.getArgs(), 'authScope');
        if (authScope) {
          authHeader = authScope.authScope.split(' ');
        }
      }

      if (authHeader && authHeader.length > 0) {
        const jwtToken = authHeader[authHeader.length - 1] || request.query.token;

        if (jwtToken !== undefined && jwtToken !== null && jwtToken !== DefaultRoles.public) {
          const decryptedToken = jwt.verify(jwtToken, AuthService.jwtSecret) as ITokenPayload;

          SessionUtil.setAccountId = decryptedToken.accountId;
          SessionUtil.setAccountRealm = decryptedToken.realm;
          SessionUtil.setAccountRoles = decryptedToken.roles;

          await this.loginHistoryService.updateActions(decryptedToken.sessionId, context.getHandler().name);

          if (!isPublic) {
            const session = await this.sessionRepository.findOne({
              token: jwtToken,
            });

            if (!session) {
              throw new HttpException('Invalid session authorization token', 401);
            }

            if (permissions.indexOf(DefaultRoles.authenticated) >= 0) {
              return true;
            }

            return decryptedToken.roles.some(role => permissions.indexOf(role) >= 0);
          }
        }
      }

      return isPublic;
    } catch (e) {
      return ExceptionHandler(e, 401);
    }
  }
}
