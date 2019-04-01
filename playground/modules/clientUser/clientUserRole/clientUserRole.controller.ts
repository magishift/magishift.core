import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { IUserRole, IUserRoleDto } from '../../../../src/user/userRole/interfaces/userRole.interface';
import { UserRoleControllerFactory } from '../../../../src/user/userRole/userRole.controller';
import { CLIENT_USER_ENDPOINT } from '../interfaces/clientUser.const';
import { ClientUserRoleMapper } from './clientUserRole.mapper';
import { ClientUserRoleService } from './clientUserRole.service';
import { CLIENT_ROLE_ENDPOINT } from './interfaces/clientUser.const';

@Controller(CLIENT_ROLE_ENDPOINT)
export class ClientUserRoleController extends UserRoleControllerFactory<IUserRoleDto, IUserRole>(CLIENT_USER_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(protected readonly service: ClientUserRoleService, protected readonly mapper: ClientUserRoleMapper) {
    super(service, mapper);
  }
}