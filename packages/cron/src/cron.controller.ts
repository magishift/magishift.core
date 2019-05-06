import { Controller } from '@nestjs/common';
import { CronService } from './cron.service';

@Controller()
export class CronController {
  constructor(protected readonly service: CronService) {}
}
