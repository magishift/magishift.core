import { IBaseDto, IBaseEntity } from '@magishift/base';

import { IAccountRole, IAccountRoleDto } from './userRole.interface';

export interface IAccount extends IBaseEntity {
  accountId: string;
  email: string;
  username: string;
  enabled: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  realmRoles: IAccountRole[];
}

export interface IAccountDto extends IBaseDto {
  accountId: string;
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
  enabled: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  realmRoles: IAccountRoleDto[];
}
