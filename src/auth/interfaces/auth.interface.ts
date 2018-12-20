import { IUserDto } from '../../user/interfaces/user.interface';

export interface ILoginData {
  readonly username: string;
  readonly password: string;

  role: string;
}

export interface ILoginDataDto {
  readonly username: string;
  readonly password: string;

  role: string;
}

export interface ITokenPayload {
  readonly realm: string;
  readonly roles: string[];
  readonly accountId: string;
  readonly sessionId: string;
  readonly userData: IUserDto;
}

export interface IToken {
  readonly id: string;
  readonly ttl: string;
}

export interface ITokenUser extends IToken {
  readonly accountId: string;
  readonly userData: IUserDto;
}
