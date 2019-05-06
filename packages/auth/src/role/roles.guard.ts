import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthService } from '../auth.service';
import { DefaultRoles } from './defaultRoles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Get method or class permissions
      const rolePermissions: string[] =
        this.reflector.get<string[]>('roles', context.getHandler()) ||
        this.reflector.get<string[]>('roles', context.getClass());

      const realmPermissions: string[] =
        this.reflector.get<string[]>('realm', context.getHandler()) ||
        this.reflector.get<string[]>('realm', context.getClass());

      const isPublic =
        !rolePermissions || rolePermissions.length === 0 || rolePermissions.indexOf(DefaultRoles.public) >= 0;

      // Get request data
      let request = context.switchToHttp().getRequest();

      if (!request) {
        const ctx = GqlExecutionContext.create(context);
        request = ctx.getContext().req;
      }

      const headerRealm: string = request.headers.realm || request.query.realm;
      if (!isPublic && !headerRealm) {
        throw new HttpException('Resource is not public, you must provide "realm" in request headers', 400);
      }

      const headerAuth: string[] = request.headers.authorization
        ? request.headers.authorization.split(' ')
        : [request.query.token];

      if (headerAuth && headerAuth.length > 0 && headerRealm) {
        const jwtToken = headerAuth[headerAuth.length - 1] || request.query.token;

        if (realmPermissions && realmPermissions.length > 0 && realmPermissions.indexOf(headerRealm) === -1) {
          return false;
        }

        return await AuthService.authorizeToken(jwtToken, context.getHandler().name, headerRealm, rolePermissions);
      }

      return isPublic;
    } catch (e) {
      throw new HttpException(e.message || e, e.status || HttpStatus.UNAUTHORIZED);
    }
  }
}
