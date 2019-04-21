import { Field, ObjectType } from 'type-graphql';
import { IUserDto } from '../user/interfaces/user.interface';
import { ITokenUser } from './interfaces/auth.interface';

@ObjectType({ isAbstract: true })
export class TokenUser<TUser extends IUserDto> implements ITokenUser {
  @Field()
  readonly accessToken: string;

  @Field()
  readonly refreshToken: string;

  @Field()
  readonly ttl: number;

  @Field()
  readonly accountId: string;

  readonly userData: TUser;

  @Field()
  readonly realm: string;
}
