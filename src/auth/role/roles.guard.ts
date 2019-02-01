import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as lodash from 'lodash';
import { ExceptionHandler } from '../../utils/error.utils';
import { AuthService } from '../auth.service';
import { DefaultRoles } from './role.const';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly reflector: Reflector) {}

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

        return await this.authService.authorizeToken(jwtToken, context.getHandler().name, permissions);
      }

      return isPublic;
    } catch (e) {
      return ExceptionHandler(e, 401);
    }
  }
}
