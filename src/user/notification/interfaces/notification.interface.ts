import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';
import { IUserDto } from '../../../user/interfaces/user.interface';

export interface INotification extends ICrudEntity {
  from: string;
  to: string;
  title: string;
  message: string;
}

export interface INotificationDto extends ICrudDto {
  from: IUserDto;
  to: IUserDto;
  title: string;
  message: string;
}
