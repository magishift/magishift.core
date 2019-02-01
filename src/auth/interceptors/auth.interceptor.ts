import { ExecutionContext, HttpException, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ = require('lodash');
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DefaultRoles } from '../role/role.const';
import { SessionUtil } from '../session.util';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(@Inject('Reflector') private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    return call$.pipe(
      map(data => {
        const permissions: string[] =
          this.reflector.get<string[]>('roles', context.getHandler()) ||
          this.reflector.get<string[]>('roles', context.getClass());

        if (
          permissions &&
          permissions.indexOf(DefaultRoles.owner) >= 0 &&
          SessionUtil.getUserRoles.indexOf(DefaultRoles.admin) < 0
        ) {
          const findDataOwner: any = _.find(data, '_dataOwner');

          if (
            findDataOwner &&
            findDataOwner._dataOwner &&
            findDataOwner._dataOwner.id &&
            findDataOwner._dataOwner.id !== SessionUtil.getAccountId
          ) {
            throw new HttpException(`Only ${DefaultRoles.admin} or owner of this data can access this data`, 403);
          }
        }

        return data;
      }),
    );
  }
}
