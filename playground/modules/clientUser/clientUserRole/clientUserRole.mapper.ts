import { Injectable } from '@nestjs/common';
import { IUserRole, IUserRoleDto } from '../../../../src/user/userRole/interfaces/userRole.interface';
import { UserRoleMapper } from '../../../../src/user/userRole/userRole.mapper';
import { ClientUserRoleDto } from './clientUserRole.dto';
import { ClientUserRole } from './clientUserRole.entity';

@Injectable()
export class ClientUserRoleMapper extends UserRoleMapper<IUserRole, IUserRoleDto> {
  constructor() {
    super(ClientUserRole, ClientUserRoleDto);
  }
}
