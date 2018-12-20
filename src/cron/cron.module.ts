import { Global, Module } from '@nestjs/common';
import * as Agenda from 'agenda';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';

@Global()
@Module({
  controllers: [CronController],
  providers: [CronService],
  exports: [CronModule],
})
export class CronModule {
  configureAgenda(agenda: Agenda): void {
    CronService.setAgendaInstance = agenda;
  }
}
