import { Field, InterfaceType } from 'type-graphql';
import { IUserDto } from '../../user/interfaces/user.interface';

@InterfaceType()
export abstract class ITokenPayload {
  @Field()
  readonly email: string;

  @Field()
  readonly email_verified: boolean;

  @Field()
  readonly exp: number;

  @Field()
  readonly family_name: string;

  @Field()
  readonly given_name: string;

  @Field()
  readonly name: string;

  @Field()
  readonly nonce: string;

  @Field()
  readonly preferred_username: string;

  readonly realm_access: { roles: string[] };

  readonly resource_access: object;

  @Field()
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

@InterfaceType({ isAbstract: true })
export abstract class ITokenUser {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly ttl: number;
  readonly accountId: string;
  readonly userData: IUserDto;
  readonly realm: string;
}
