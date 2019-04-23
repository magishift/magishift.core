import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../../src/crud/crud.controller';
import { IUserRole, IUserRoleDto } from '../../../../src/user/userRole/interfaces/userRole.interface';
import { ClientUserRoleDto } from './clientUserRole.dto';
import { ClientUserRoleMapper } from './clientUserRole.mapper';
import { ClientUserRoleService } from './clientUserRole.service';
import { CLIENT_ROLE_ENDPOINT } from './interfaces/clientUser.const';

@Controller(CLIENT_ROLE_ENDPOINT)
export class ClientUserRoleController extends CrudControllerFactory<IUserRoleDto, IUserRole>(
  CLIENT_ROLE_ENDPOINT,
  ClientUserRoleDto,
  {
    default: [DefaultRoles.admin],
  },
) {
  constructor(protected readonly service: ClientUserRoleService, protected readonly mapper: ClientUserRoleMapper) {
    super(service, mapper);
  }
}
