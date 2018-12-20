import { ReflectMetadata } from '@nestjs/common';
import { DefaultRoles } from './role.const';

export const Roles = (...roles: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[]) =>
  ReflectMetadata('roles', roles);
