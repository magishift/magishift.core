import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { FileStorageService } from '../../../../src/fileStorage/fileStorage.service';
import { UserControllerFactory } from '../../../../src/user/user.controller';
import { VENDOR_USER_ENDPOINT } from './interfaces/vendorUser.const';
import { IVendorUser, IVendorUserDto } from './interfaces/vendorUser.interface';
import { VendorUserDto } from './vendorUser.dto';
import { VendorUserMapper } from './vendorUser.mapper';
import { VendorUserService } from './vendorUser.service';

@Controller(VENDOR_USER_ENDPOINT)
export class VendorUserController extends UserControllerFactory<IVendorUserDto, IVendorUser>(
  VENDOR_USER_ENDPOINT,
  VendorUserDto,
  {
    default: [DefaultRoles.admin],
  },
) {
  constructor(
    protected readonly service: VendorUserService,
    protected readonly fileService: FileStorageService,
    protected readonly mapper: VendorUserMapper,
  ) {
    super(service, fileService, mapper);
  }
}
