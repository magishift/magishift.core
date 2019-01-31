import { ILoginData, IToken } from '../../auth/interfaces/auth.interface';
import { ICrudResolver } from '../../crud/interfaces/crudResolver.interface';
import { IUser, IUserDto } from './user.interface';

export interface IUserResolver extends ICrudResolver<IUserDto, IUser> {
  login(args: ILoginData): Promise<IToken>;

  logout(ctx: any): Promise<void>;
}
