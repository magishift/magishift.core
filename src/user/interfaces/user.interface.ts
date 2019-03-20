import { IAccount, IAccountDto } from '../../auth/account/interfaces/account.interface';
import { ILoginHistoryDto } from '../../auth/loginHistory/interfaces/loginHistory.interface';
import { IRoleDto } from '../../auth/role/interfaces/role.interface';
import { ICrudDto, ICrudEntity } from '../../crud/interfaces/crud.interface';
import { IFileStorage, IFileStorageDto } from '../../fileStorage/interfaces/fileStorage.interface';
import { IDevice, IDeviceDto } from '../device/interfaces/device.interface';
import { INotification, INotificationDto } from '../notification/interfaces/notification.interface';

export interface IUser extends ICrudEntity {
  account: IAccount;
  name: string;
  email: string;
  phoneNumber: string;
  realm: string;
  photo: IFileStorage;
  notificationsSendTo: INotification[];
  notificationsSendFrom: INotification[];
  devices: IDevice[];
}

export interface IUserDto extends ICrudDto {
  accountId: string;
  account: IAccountDto;
  name: string;
  email: string;
  phoneNumber: string;
  photo: IFileStorageDto;
  username: string;
  password: string;
  passwordConfirm: string;
  realm: string;
  roles: IRoleDto[];
  loginHistories?: ILoginHistoryDto[];
  notifications?: INotificationDto[];
  devices?: IDeviceDto[];
}
