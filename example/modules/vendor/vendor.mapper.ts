import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../../src/crud/crud.mapper';
import { IVendor, IVendorDto } from './interfaces/vendor.interface';
import { VendorDto } from './vendor.dto';
import { Vendor } from './vendor.entity';

@Injectable()
export class VendorMapper extends CrudMapper<IVendor, IVendorDto> {
  constructor() {
    super(Vendor, VendorDto);
  }
}
