import { IUser, IUserDto } from '../../../user/interfaces/user.interface';

export interface IAdmin extends IUser {
  role: 'admin';
}

export interface IAdminDto extends IUserDto {
  role: 'admin';
}
