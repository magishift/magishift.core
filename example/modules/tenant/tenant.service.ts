import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../../src/crud/crud.service';
import { DraftService } from '../../../src/crud/draft/draft.service';
import { ITenant, ITenantDto } from './interfaces/tenant.interface';
import { Tenant } from './tenant.entity';
import { TenantMapper } from './tenant.mapper';

@Injectable()
export class TenantService extends CrudService<ITenant, ITenantDto> {
  constructor(
    @InjectRepository(Tenant) protected readonly repository: Repository<Tenant>,
    protected readonly mapper: TenantMapper,
    protected readonly draftService: DraftService,
  ) {
    super(repository, draftService, mapper);
  }
}
