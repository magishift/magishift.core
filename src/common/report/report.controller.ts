import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../auth/role/defaultRoles';
import { CrudControllerFactory } from '../crud/crud.controller';
import { REPORT_ENDPOINT } from './interfaces/report.const';
import { IReport, IReportDto } from './interfaces/report.interface';
import { ReportMapper } from './report.mapper';
import { ReportService } from './report.service';

@Controller(REPORT_ENDPOINT)
export class ReportController extends CrudControllerFactory<IReportDto, IReport>(REPORT_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(protected readonly service: ReportService, protected readonly mapper: ReportMapper) {
    super(service, mapper);
  }
}
