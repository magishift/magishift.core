import { CronService } from './cron.service';

export class CronResolver {
  constructor(protected readonly twilioService: CronService) {}
}
