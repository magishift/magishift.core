import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../../../src/crud/crud.service';
import { DraftService } from '../../../../src/crud/draft/draft.service';
import { IVendorExpertTeam, IVendorExpertTeamDto } from './interfaces/vendorExpertTeam.interface';
import { VendorExpertTeam } from './vendorExpertTeam.entity';
import { VendorExpertTeamMapper } from './vendorExpertTeam.mapper';

@Injectable()
export class VendorExpertTeamService extends CrudService<IVendorExpertTeam, IVendorExpertTeamDto> {
  constructor(
    @InjectRepository(VendorExpertTeam) protected readonly repository: Repository<VendorExpertTeam>,
    protected readonly draftService: DraftService,
    protected readonly mapper: VendorExpertTeamMapper,
  ) {
    super(repository, draftService, mapper);
  }
}
