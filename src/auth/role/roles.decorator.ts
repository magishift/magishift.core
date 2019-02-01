import { ReflectMetadata } from '@nestjs/common';
import { DefaultRoles } from './role.const';

export const Roles = (
  ...roles: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.superAdmin | string)[]
) => ReflectMetadata('roles', roles);
