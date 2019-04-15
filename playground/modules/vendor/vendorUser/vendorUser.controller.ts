import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { FileStorageService } from '../../../../src/fileStorage/fileStorage.service';
import { IUser, IUserDto } from '../../../../src/user/interfaces/user.interface';
import { UserControllerFactory } from '../../../../src/user/user.controller';
import { VENDOR_USER_ENDPOINT } from './interfaces/vendorUser.const';
import { VendorUserMapper } from './vendorUser.mapper';
import { VendorUserService } from './vendorUser.service';

@Controller(VENDOR_USER_ENDPOINT)
export class VendorUserController extends UserControllerFactory<IUserDto, IUser>(VENDOR_USER_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: VendorUserService,
    protected readonly fileService: FileStorageService,
    protected readonly mapper: VendorUserMapper,
  ) {
    super(service, fileService, mapper);
  }
}
