import { Controller } from '@nestjs/common';
import { CrudControllerFactory } from '../../crud/crud.controller';
import { ROLE_ENDPOINT } from './interfaces/role.const';
import { IRole, IRoleDto } from './interfaces/role.interface';
import { DefaultRoles } from './role.const';
import { RoleMapper } from './role.mapper';
import { RoleService } from './role.service';

@Controller(ROLE_ENDPOINT)
export class RoleController extends CrudControllerFactory<IRoleDto, IRole>(ROLE_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(protected readonly service: RoleService, protected readonly mapper: RoleMapper) {
    super(service, mapper);
  }
}
