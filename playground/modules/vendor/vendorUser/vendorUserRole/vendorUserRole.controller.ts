import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../../../src/auth/role/defaultRoles';
import { IUserRole, IUserRoleDto } from '../../../../../src/user/userRole/interfaces/userRole.interface';
import { UserRoleControllerFactory } from '../../../../../src/user/userRole/userRole.controller';
import { VENDOR_ROLE_ENDPOINT } from './interfaces/vendorUser.const';
import { VendorUserRoleMapper } from './vendorUserRole.mapper';
import { VendorUserRoleService } from './vendorUserRole.service';

@Controller(VENDOR_ROLE_ENDPOINT)
export class VendorUserRoleController extends UserRoleControllerFactory<IUserRoleDto, IUserRole>(VENDOR_ROLE_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(protected readonly service: VendorUserRoleService, protected readonly mapper: VendorUserRoleMapper) {
    super(service, mapper);
  }
}
