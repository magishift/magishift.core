import { ILoginData, ITokenUser } from '../../auth/interfaces/auth.interface';
import { ICrudResolver } from '../../crud/interfaces/crudResolver.interface';
import { IUser, IUserDto } from './user.interface';

export interface IUserResolver extends ICrudResolver<IUserDto, IUser> {
  login(args: ILoginData): Promise<ITokenUser>;

  logout(): Promise<boolean>;
}
