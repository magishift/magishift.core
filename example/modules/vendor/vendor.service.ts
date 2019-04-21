import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../../src/crud/crud.service';
import { DraftService } from '../../../src/crud/draft/draft.service';
import { IVendor, IVendorDto } from './interfaces/vendor.interface';
import { Vendor } from './vendor.entity';
import { VendorMapper } from './vendor.mapper';

@Injectable()
export class VendorService extends CrudService<IVendor, IVendorDto> {
  constructor(
    @InjectRepository(Vendor) protected readonly repository: Repository<Vendor>,
    protected readonly mapper: VendorMapper,
    protected readonly draftService: DraftService,
  ) {
    super(repository, draftService, mapper);
  }
}
