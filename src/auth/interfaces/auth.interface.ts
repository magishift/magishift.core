import { IUserDto } from '../../user/interfaces/user.interface';

export abstract class ITokenPayload {
  readonly email: string;
  readonly email_verified: boolean;
  readonly exp: number;
  readonly family_name: string;
  readonly given_name: string;
  readonly name: string;
  readonly nonce: string;
  readonly preferred_username: string;
  readonly realm_access: { roles: string[] };
  readonly resource_access: object;
  readonly scope: string;

  /**
   * Session Id
   *
   * @type {string}
   * @memberof ITokenPayload
   */
  readonly session_state: string;

  /**
   * Account Id
   *
   * @type {string}
   * @memberof ITokenPayload
   */
  readonly sub: string;
  readonly typ: string;
  readonly azp: string;
}

export interface ITokenUser {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly ttl: number;
  readonly accountId: string;
  readonly userData: IUserDto;
  readonly realm: string;
}
