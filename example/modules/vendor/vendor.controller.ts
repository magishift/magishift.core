import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { VENDOR_ENDPOINT } from './interfaces/vendor.const';
import { IVendor, IVendorDto } from './interfaces/vendor.interface';
import { VendorDto } from './vendor.dto';
import { VendorMapper } from './vendor.mapper';
import { VendorService } from './vendor.service';

@Controller(VENDOR_ENDPOINT)
export class VendorController extends CrudControllerFactory<IVendorDto, IVendor>(VENDOR_ENDPOINT, VendorDto, {
  default: [DefaultRoles.admin],
}) {
  constructor(protected readonly service: VendorService, protected readonly mapper: VendorMapper) {
    super(service, mapper);
  }
}
