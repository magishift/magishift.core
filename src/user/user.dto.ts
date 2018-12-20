import { IAccountDto } from '../auth/account/interfaces/account.interface';
import { ILoginHistoryDto } from '../auth/loginHistory/interfaces/loginHistory.interface';
import { CrudDto } from '../crud/crud.dto';
import { IFileStorageDto } from '../fileStorage/interfaces/fileStorage.interface';
import { IDeviceDto } from './device/interfaces/device.interface';
import { IUserDto } from './interfaces/user.interface';
import { INotificationDto } from './notification/interfaces/notification.interface';

export abstract class UserDto extends CrudDto implements IUserDto {
  accountId: string;

  account: IAccountDto;

  username: string;

  password: string;

  passwordConfirm: string;

  loginHistories?: ILoginHistoryDto[];

  abstract photo: IFileStorageDto;

  abstract name: string;

  abstract email: string;

  abstract phoneNumber: string;

  abstract role: string;

  abstract realm: string;

  isActive: boolean = false;

  notifications: INotificationDto[];

  devices: IDeviceDto[];
}
