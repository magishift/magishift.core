import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../auth/role/defaultRoles';
import { CrudResolverFactory } from '../../crud/crud.resolver';
import { REPORT_ENDPOINT } from './interfaces/report.const';
import { IReport, IReportDto } from './interfaces/report.interface';
import { ReportDto } from './report.dto';
import { ReportMapper } from './report.mapper';
import { ReportService } from './report.service';

@Resolver(REPORT_ENDPOINT)
export class ReportResolver extends CrudResolverFactory<IReportDto, IReport>(REPORT_ENDPOINT, ReportDto, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: ReportService,
    protected readonly mapper: ReportMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
