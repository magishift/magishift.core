import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';
import { IUserDto } from '../../interfaces/user.interface';

export interface IDevice extends ICrudEntity {
  ownerId: string;
  deviceFcmToken: string;
  deviceInfo: string;
}

export interface IDeviceDto extends ICrudDto {
  user: IUserDto;
  deviceFcmToken: string;
  deviceInfo: string;
}
