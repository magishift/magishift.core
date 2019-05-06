import { IAccount } from './account.interface';

export interface ITokenUser {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly ttl: number;
  readonly accountId: string;
  readonly userData: Readonly<IAccount>;
  readonly realm: string;
}
