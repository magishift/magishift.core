import { ILoginData, IToken } from '../../auth/interfaces/auth.interface';
import { ICrudResolver } from '../../crud/interfaces/crudResolver.interface';

export interface IUserResolver extends ICrudResolver {
  login(args: ILoginData): Promise<IToken>;

  logout(ctx: any): Promise<void>;
}
