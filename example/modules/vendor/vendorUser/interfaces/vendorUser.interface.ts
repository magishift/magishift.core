import { IUser, IUserDto } from '../../../../../src/user/interfaces/user.interface';
import { IVendor, IVendorDto } from '../../interfaces/vendor.interface';

export interface IVendorUser extends IUser {
  vendor: IVendor;
  canLogin: boolean;
}

export interface IVendorUserDto extends IUserDto {
  vendor: IVendorDto;
  canLogin: boolean;
}
