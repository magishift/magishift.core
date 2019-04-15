import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../auth/role/defaultRoles';
import { IUserRole, IUserRoleDto } from '../../../user/userRole/interfaces/userRole.interface';
import { UserRoleControllerFactory } from '../../../user/userRole/userRole.controller';
import { BO_USER_ENDPOINT, BO_USER_REALM } from '../interfaces/backOfficeUser.const';
import { BackOfficeRoleMapper } from './backOfficeRole.mapper';
import { BackOfficeRoleService } from './backOfficeRole.service';
import { BO_ROLE_ENDPOINT } from './interfaces/backOfficeUser.const';

@Controller(BO_ROLE_ENDPOINT)
export class BackOfficeRoleController extends UserRoleControllerFactory<IUserRoleDto, IUserRole>(
  BO_USER_ENDPOINT,
  {
    default: [DefaultRoles.admin],
  },
  [BO_USER_REALM],
) {
  constructor(protected readonly service: BackOfficeRoleService, protected readonly mapper: BackOfficeRoleMapper) {
    super(service, mapper);
  }
}
