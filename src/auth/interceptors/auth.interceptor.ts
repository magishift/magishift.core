import { ExecutionContext, HttpException, HttpStatus, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ = require('lodash');
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExceptionHandler } from '../../utils/error.utils';
import { DefaultRoles } from '../role/defaultRoles';
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
          SessionUtil.getAccountRoles.indexOf(DefaultRoles.admin) < 0
        ) {
          const findDataOwner: any = _.find(data, '_dataOwner');

          if (findDataOwner && findDataOwner._dataOwner && findDataOwner._dataOwner !== SessionUtil.getAccountId) {
            throw new HttpException(
              `Only ${DefaultRoles.admin} or owner of this data can access this data`,
              HttpStatus.FORBIDDEN,
            );
          }
        }

        return data;
      }),
    );
  }
}
