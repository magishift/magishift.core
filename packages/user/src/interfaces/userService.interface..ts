import { TokenUser } from '../../auth/auth.token';
import { LoginInput } from '../../auth/loginData.dto';
import { ICrudService } from '../../crud/interfaces/crudService.interface';
import { IUser, IUserDto } from './user.interface';

export interface IUserService<TEntity extends IUser, TDto extends IUserDto> extends ICrudService<TEntity, TDto> {
  login(data: LoginInput): Promise<TokenUser>;

  logout(): Promise<boolean>;
}
