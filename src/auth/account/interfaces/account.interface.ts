import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';

export interface IAccount extends ICrudEntity {
  username: string;
  enabled: boolean;
  emailVerified: boolean;
  email: string;
  firstName: string;
  lastName: string;
  realmRoles: string[];
}

export interface IAccountDto extends ICrudDto {
  username: string;
  enabled: boolean;
  emailVerified: boolean;
  email: string;
  firstName: string;
  lastName: string;
  realmRoles: string[];
  password?: string;
  passwordConfirm?: string;
}
