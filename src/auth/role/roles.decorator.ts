import { SetMetadata } from '@nestjs/common';
import { DefaultRoles } from './role.const';

export const Roles = (...roles: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[]) =>
  SetMetadata('roles', roles);
