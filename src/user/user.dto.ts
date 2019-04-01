import { ILoginHistoryDto } from '../auth/loginHistory/interfaces/loginHistory.interface';
import { CrudDto } from '../crud/crud.dto';
import { IFileStorageDto } from '../fileStorage/interfaces/fileStorage.interface';
import { IDeviceDto } from './device/interfaces/device.interface';
import { IUserDto } from './interfaces/user.interface';
import { INotificationDto } from './notification/interfaces/notification.interface';
import { IUserRoleDto } from './userRole/interfaces/userRole.interface';

export abstract class UserDto extends CrudDto implements IUserDto {
  abstract accountId: string;

  abstract enabled: boolean;

  abstract emailVerified: boolean;

  abstract firstName: string;

  abstract lastName: string;

  abstract realmRoles: IUserRoleDto[];

  abstract username: string;

  abstract password: string;

  abstract passwordConfirm: string;

  abstract photo: IFileStorageDto;

  abstract email: string;

  abstract phoneNumber: string;

  realm: string;

  loginHistories?: ILoginHistoryDto[];

  notifications: INotificationDto[];

  devices: IDeviceDto[];
}
