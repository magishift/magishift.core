import { SetMetadata } from '@nestjs/common';
import { DefaultRoles } from './defaultRoles';

export const Roles = (...roles: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[]) =>
  SetMetadata('roles', roles);
