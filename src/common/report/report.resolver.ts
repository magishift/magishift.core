import { Inject, UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../auth/role/defaultRoles';
import { RolesGuard } from '../../auth/role/roles.guard';
import { ResolverFactory } from '../../crud/crud.resolver';
import { REPORT_ENDPOINT } from './interfaces/report.const';
import { IReport, IReportDto } from './interfaces/report.interface';
import { ReportMapper } from './report.mapper';
import { ReportService } from './report.service';

@UseGuards(RolesGuard)
@Resolver(REPORT_ENDPOINT)
export class ReportResolver extends ResolverFactory<IReportDto, IReport>(REPORT_ENDPOINT, {
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
