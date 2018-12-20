import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpService } from '../../http/http.service';
import { NotificationController } from './notification.controller';
import { NotificationDto } from './notification.dto';
import { Notification } from './notification.entity';
import { NotificationMapper } from './notification.mapper';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationService, NotificationMapper, NotificationDto, HttpService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
