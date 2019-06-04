import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../crud/crud.service';
import { DraftService } from '../../crud/draft/draft.service';
import { INotification, INotificationDto } from './interfaces/notification.interface';
import { Notification } from './notification.entity';
import { NotificationMapper } from './notification.mapper';

@Injectable()
export class NotificationService extends CrudService<INotification, INotificationDto> {
  constructor(
    @InjectRepository(Notification) protected readonly notificationRepository: Repository<Notification>,
    protected readonly draftService: DraftService,
    protected readonly mapper: NotificationMapper,
  ) {
    super(notificationRepository, draftService, mapper);
  }
}
