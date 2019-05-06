import { IBaseEntity } from '@magishift/base';

export interface ISession extends IBaseEntity {
  readonly accountId: string;
  readonly token: string;
  readonly expireOn: string;
}
