import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../crud/crud.service';
import { DraftService } from '../crud/draft/draft.service';
import { IReport, IReportDto } from './interfaces/report.interface';
import { Report } from './report.entity';
import { ReportMapper } from './report.mapper';

@Injectable()
export class ReportService extends CrudService<IReport, IReportDto> {
  constructor(
    @InjectRepository(Report) protected readonly repository: Repository<Report>,
    protected readonly mapper: ReportMapper,
    protected readonly draftService: DraftService,
  ) {
    super(repository, draftService, mapper);
  }
}
