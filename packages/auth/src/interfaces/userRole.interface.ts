import { IBaseDto, IBaseEntity } from '@magishift/base';

import { IAccount, IAccountDto } from './account.interface';

export interface IAccountRole extends IBaseEntity {
  id: string;
  name: string;
  description: string;
  users: IAccount[];
}

export interface IAccountRoleDto extends IBaseDto {
  id: string;
  name: string;
  description: string;
  users: IAccountDto[];
}
