import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';
import { IUser, IUserDto } from '../../interfaces/user.interface';

export interface IUserRole extends ICrudEntity {
  id: string;
  name: string;
  description: string;
  users: IUser[];
}

export interface IUserRoleDto extends ICrudDto {
  id: string;
  name: string;
  description: string;
  users: IUserDto[];
}
