import { Controller, Get } from '@nestjs/common';
import { DefaultRoles } from '../../auth/role/defaultRoles';
import { Roles } from '../../auth/role/roles.decorator';
import { CrudControllerFactory } from '../../crud/crud.controller';
import { HttpService } from '../../http/http.service';
import { REPORT_ENDPOINT } from './interfaces/report.const';
import { IReport, IReportDto } from './interfaces/report.interface';
import { ReportMapper } from './report.mapper';
import { ReportService } from './report.service';

@Controller(REPORT_ENDPOINT)
export class ReportController extends CrudControllerFactory<IReportDto, IReport>(REPORT_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: ReportService,
    protected readonly mapper: ReportMapper,
    protected readonly httpService: HttpService,
  ) {
    super(service, mapper);
  }
  @Get('dashboard')
  @Roles(DefaultRoles.authenticated)
  async getDashboard(): Promise<IReportDto[]> {
    return await this.service.findAll({ order: ['index ASC'] });
  }
}
