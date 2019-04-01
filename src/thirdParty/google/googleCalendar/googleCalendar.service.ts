import { Injectable } from '@nestjs/common';
import { calendar_v3, google } from 'googleapis';
import { ConfigService } from '../../../config/config.service';
import { ExceptionHandler } from '../../../utils/error.utils';
import { GoogleConfigService } from '../google.service';

const TIMEZONE_JAKARTA = `Asia/Jakarta`;

@Injectable()
export class GoogleCalendarService {
  constructor(protected readonly googleConfigService: GoogleConfigService) {}

  async listEvents(): Promise<string[] | string> {
    if (!GoogleConfigService.oAuth2Client) {
      return 'Google calendar API not configured properly';
    }

    try {
      const calendar = google.calendar({
        version: 'v3',
        auth: GoogleConfigService.oAuth2Client,
      });

      const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = res.data.items;
      if (events.length) {
        return events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          return `${start} - ${event.summary}`;
        });
      } else {
        return 'No upcoming events found.';
      }
    } catch (e) {
      return ExceptionHandler(e.message || e, 500);
    }
  }

  async createEvent(
    summary: string,
    location: string,
    description: string,
    date: Date,
    ...attendees: string[]
  ): Promise<any> {
    const calendar = google.calendar({
      version: 'v3',
      auth: GoogleConfigService.oAuth2Client,
    });

    if (typeof date === 'string') {
      date = new Date(date);
    }

    // always include admin user
    attendees.push(ConfigService.getConfig.email.username);

    const event: calendar_v3.Schema$Event = {
      summary,
      location,
      description,
      start: {
        dateTime: date.toISOString(),
        timeZone: TIMEZONE_JAKARTA,
      },
      end: {
        dateTime: new Date(date.setHours(date.getHours() + 1)).toISOString(),
        timeZone: TIMEZONE_JAKARTA,
      },
      attendees: attendees.map(item => {
        return {
          email: item,
          responseStatus: 'needsAction',
        };
      }),
      reminders: {
        useDefault: false,
        overrides: [{ method: 'email', minutes: 24 * 60 }, { method: 'popup', minutes: 24 * 60 }],
      },
    };

    return calendar.events.insert({
      calendarId: 'primary',
      sendNotifications: true,
      requestBody: event,
    });
  }
}
