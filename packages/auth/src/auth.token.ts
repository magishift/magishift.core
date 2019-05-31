import { Field, ObjectType } from 'type-graphql';

import { IAccountDto } from './interfaces/account.interface';
import { ITokenUser } from './interfaces/tokenUser.interface';

@ObjectType({ isAbstract: true })
export class TokenUser<TUser extends IAccountDto> implements ITokenUser {
  @Field()
  readonly accessToken: string;

  @Field()
  readonly refreshToken: string;

  @Field()
  readonly ttl: number;

  @Field()
  readonly accountId: string;

  @Field()
  readonly realm: string;

  readonly userData: TUser;
}
