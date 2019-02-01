import { Controller } from '@nestjs/common';
import { CrudControllerFactory } from '../../crud/crud.controller';
import { ROLE_ENDPOINT } from './interfaces/rol.const';
import { IRole, IRoleDto } from './interfaces/Role.interface';
import { DefaultRoles } from './role.const';
import { RoleMapper } from './Role.mapper';
import { RoleService } from './Role.service';

@Controller(ROLE_ENDPOINT)
export class RoleController extends CrudControllerFactory<IRoleDto, IRole>(ROLE_ENDPOINT, {
  default: [DefaultRoles.authenticated],
}) {
  constructor(protected readonly service: RoleService, protected readonly mapper: RoleMapper) {
    super(service, mapper);
  }
}
