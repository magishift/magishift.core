import { ITokenUser } from '../../auth/interfaces/auth.interface';
import { LoginData } from '../../auth/loginData.dto';
import { ICrudService } from '../../crud/interfaces/crudService.interface';
import { IUser, IUserDto } from './user.interface';

export interface IUserService<TEntity extends IUser, TDto extends IUserDto> extends ICrudService<TEntity, TDto> {
  login(data: LoginData): Promise<ITokenUser>;

  logout(): Promise<boolean>;
}
