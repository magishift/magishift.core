import { ILoginHistoryDto } from '../../auth/loginHistory/interfaces/loginHistory.interface';
import { ICrudDto, ICrudEntity } from '../../crud/interfaces/crud.interface';
import { IFileStorage, IFileStorageDto } from '../../fileStorage/interfaces/fileStorage.interface';
import { IDevice, IDeviceDto } from '../device/interfaces/device.interface';
import { INotification, INotificationDto } from '../notification/interfaces/notification.interface';
import { IUserRole, IUserRoleDto } from '../userRole/interfaces/userRole.interface';

export interface IUser extends ICrudEntity {
  accountId: string;
  email: string;
  phoneNumber: string;
  photo: IFileStorage;
  notificationsSendTo: INotification[];
  notificationsSendFrom: INotification[];
  devices: IDevice[];
  username: string;
  enabled: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  realmRoles: IUserRole[];
  realm: string;
}

export interface IUserDto extends ICrudDto {
  accountId: string;
  email: string;
  phoneNumber: string;
  photo: IFileStorageDto;
  username: string;
  password: string;
  passwordConfirm: string;
  realm: string;
  loginHistories?: ILoginHistoryDto[];
  notifications?: INotificationDto[];
  devices?: IDeviceDto[];
  enabled: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  realmRoles: IUserRoleDto[];
}
