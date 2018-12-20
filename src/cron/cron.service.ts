import * as Agenda from 'agenda';

export class CronService {
  static set setAgendaInstance(agenda: Agenda) {
    CronService.agendaInstance = agenda;
  }

  static agendaInstance: Agenda = null;
}
