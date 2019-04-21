import { ITokenUser } from '../../auth/interfaces/auth.interface';
import { LoginInput } from '../../auth/loginData.dto';
import { ICrudResolver } from '../../crud/interfaces/crudResolver.interface';
import { IUserDto } from './user.interface';

export interface IUserResolver extends ICrudResolver<IUserDto> {
  login(args: LoginInput): Promise<ITokenUser>;

  logout(): Promise<boolean>;
}
