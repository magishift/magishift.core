import { IBaseEntity } from '../../base/interfaces/base.interface';

export interface ISession extends IBaseEntity {
  readonly accountId: string;
  readonly token: string;
  readonly expireOn: string;
}
