import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as lodash from 'lodash';
import { AuthService } from '../auth.service';
import { SessionUtil } from '../session.util';
import { DefaultRoles } from './defaultRoles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Get method or class permissions
      const permissions: string[] =
        this.reflector.get<string[]>('roles', context.getHandler()) ||
        this.reflector.get<string[]>('roles', context.getClass());

      const isPublic = !permissions || permissions.length === 0 || permissions.indexOf(DefaultRoles.public) >= 0;

      // Get request data
      const request = context.switchToHttp().getRequest();

      // resolve realm
      const headerRealm: string =
        request.headers.realm || request.headers['x-realm'] || lodash.find(context.getArgs(), 'authRealm');

      if (!headerRealm && !isPublic) {
        throw new HttpException('No realm found in request header', 400);
      }

      let headerAuth: string[];
      // if request doesn't exist use authScope
      if (request && request.headers && request.headers.authorization) {
        headerAuth = request.headers.authorization.split(' ');
      } else {
        const authScope = lodash.find(context.getArgs(), 'authScope');
        if (authScope) {
          headerAuth = authScope.authScope.split(' ');
        }
      }

      if (((headerAuth && headerAuth.length > 0) || request.query.token) && headerRealm) {
        const jwtToken = headerAuth[headerAuth.length - 1] || request.query.token;

        SessionUtil.setAccountRealm = headerRealm;

        return await AuthService.authorizeToken(jwtToken, context.getHandler().name, headerRealm, permissions);
      }

      return isPublic;
    } catch (e) {
      throw new HttpException(e, e.status || HttpStatus.UNAUTHORIZED);
    }
  }
}
