import { Field, ObjectType } from 'type-graphql';
import { IUserDto } from '../user/interfaces/user.interface';
import { ITokenUser } from './interfaces/auth.interface';

@ObjectType()
export class TokenUser extends ITokenUser {
  @Field()
  readonly accessToken: string;

  @Field()
  readonly refreshToken: string;

  @Field()
  readonly ttl: number;

  @Field()
  readonly accountId: string;

  readonly userData: IUserDto;

  @Field()
  readonly realm: string;
}
