import { Module } from '@nestjs/common';
import { GoogleConfigModule } from '../google.module';
import { GoogleCalendarController } from './googleCalendar.controller';
import { GoogleCalendarDto } from './googleCalendar.dto';
import { GoogleCalendarService } from './googleCalendar.service';

@Module({
  imports: [GoogleConfigModule],
  providers: [GoogleCalendarService, GoogleCalendarDto],
  controllers: [GoogleCalendarController],
  exports: [GoogleCalendarService],
})
export class GoogleCalendarModule {}
