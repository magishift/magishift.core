import { Injectable } from '@nestjs/common';
import { IUserRole, IUserRoleDto } from '../../../../../src/user/userRole/interfaces/userRole.interface';
import { UserRoleMapper } from '../../../../../src/user/userRole/UserRole.mapper';
import { VendorUserRoleDto } from './vendorUserRole.dto';
import { VendorUserRole } from './vendorUserRole.entity';

@Injectable()
export class VendorUserRoleMapper extends UserRoleMapper<IUserRole, IUserRoleDto> {
  constructor() {
    super(VendorUserRole, VendorUserRoleDto);
  }
}
