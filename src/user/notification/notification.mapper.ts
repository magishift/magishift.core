import { CrudMapper } from '../../crud/crud.mapper';
import { INotification, INotificationDto } from './interfaces/notification.interface';
import { NotificationDto } from './notification.dto';
import { Notification } from './notification.entity';

export class NotificationMapper extends CrudMapper<INotification, INotificationDto> {
  constructor() {
    super(Notification, NotificationDto);
  }
}
