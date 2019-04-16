import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { ExceptionHandler } from '../../../utils/error.utils';
import { GoogleCalendarService } from './googleCalendar.service';
import { GOOGLE_CALENDAR_ENDPOINT } from './interfaces/googleCalendar.const';

@Controller(GOOGLE_CALENDAR_ENDPOINT)
@ApiUseTags(GOOGLE_CALENDAR_ENDPOINT)
export class GoogleCalendarController {
  constructor(protected readonly service: GoogleCalendarService) {}

  @Get()
  async getEvents(): Promise<string[] | string> {
    try {
      const result = await this.service.listEvents();
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
