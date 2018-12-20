import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';
import { IUserDto } from '../../../user/interfaces/user.interface';
import { ILoginHistory, ILoginHistoryDto } from '../../loginHistory/interfaces/loginHistory.interface';

export interface IAccount extends ICrudEntity {
  username: string;
  password: string;
  isActive: boolean;
  realm: string;
  roles: string[];
  createdBy: IAccount;
  updatedBy: IAccount;
  loginHistories: ILoginHistory[];
}

export interface IAccountDto extends ICrudDto {
  username: string;
  password: string;
  passwordConfirm: string;
  isActive: boolean;
  realm: string;
  roles: string[];
  user?: IUserDto;
  createdBy: IAccountDto;
  updatedBy: IAccountDto;
  loginHistories: ILoginHistoryDto[];
}
