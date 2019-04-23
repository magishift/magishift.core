import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../../../src/crud/crud.controller';
import { IUserRole, IUserRoleDto } from '../../../../../src/user/userRole/interfaces/userRole.interface';
import { VENDOR_ROLE_ENDPOINT } from './interfaces/vendorUserRole.const';
import { VendorUserRoleDto } from './vendorUserRole.dto';
import { VendorUserRoleMapper } from './vendorUserRole.mapper';
import { VendorUserRoleService } from './vendorUserRole.service';

@Controller(VENDOR_ROLE_ENDPOINT)
export class VendorUserRoleController extends CrudControllerFactory<IUserRoleDto, IUserRole>(
  VENDOR_ROLE_ENDPOINT,
  VendorUserRoleDto,
  {
    default: [DefaultRoles.admin],
  },
) {
  constructor(protected readonly service: VendorUserRoleService, protected readonly mapper: VendorUserRoleMapper) {
    super(service, mapper);
  }
}
