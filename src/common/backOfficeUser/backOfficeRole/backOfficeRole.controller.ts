import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../crud/crud.controller';
import { IUserRole, IUserRoleDto } from '../../../user/userRole/interfaces/userRole.interface';
import { BO_USER_REALM } from '../interfaces/backOfficeUser.const';
import { BackOfficeRoleDto } from './backOfficeRole.dto';
import { BackOfficeRoleMapper } from './backOfficeRole.mapper';
import { BackOfficeRoleService } from './backOfficeRole.service';
import { BO_ROLE_ENDPOINT } from './interfaces/backOfficeUser.const';

@Controller(BO_ROLE_ENDPOINT)
export class BackOfficeRoleController extends CrudControllerFactory<IUserRoleDto, IUserRole>(
  BO_ROLE_ENDPOINT,
  BackOfficeRoleDto,
  {
    default: [DefaultRoles.admin],
  },
  [BO_USER_REALM],
) {
  constructor(protected readonly service: BackOfficeRoleService, protected readonly mapper: BackOfficeRoleMapper) {
    super(service, mapper);
  }
}
