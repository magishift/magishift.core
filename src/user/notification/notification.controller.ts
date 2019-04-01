import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../auth/role/defaultRoles';
import { CrudControllerFactory } from '../../crud/crud.controller';
import { NOTIFICATION_ENDPOINT } from './interfaces/notification.const';
import { INotification, INotificationDto } from './interfaces/notification.interface';
import { NotificationMapper } from './notification.mapper';
import { NotificationService } from './notification.service';

@Controller(NOTIFICATION_ENDPOINT)
export class NotificationController extends CrudControllerFactory<INotificationDto, INotification>(
  NOTIFICATION_ENDPOINT,
  {
    default: [DefaultRoles.admin],
  },
) {
  constructor(
    protected readonly notificationService: NotificationService,
    protected readonly mapper: NotificationMapper,
  ) {
    super(notificationService, mapper);
  }
}
