import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../crud/crud.mapper';
import { IReport, IReportDto } from './interfaces/report.interface';
import { ReportDto } from './report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportMapper extends CrudMapper<IReport, IReportDto> {
  constructor() {
    super(Report, ReportDto);
  }
}
