import { ApiUseTags } from '@nestjs/swagger';
import { Roles } from '../../auth/role/roles.decorator';
import { CrudControllerFactory } from '../../crud/crud.controller';
import { CrudMapper } from '../../crud/crud.mapper';
import { IUserRole, IUserRoleDto } from './interfaces/userRole.interface';
import { IUserRoleController } from './interfaces/userRoleController.interface';
import { IEndpointUserRoles } from './interfaces/userRoleEndpoint.interface';
import { UserRoleMapper } from './userRole.mapper';
import { UserRoleService } from './userRole.service';

export function UserRoleControllerFactory<TDto extends IUserRoleDto, TEntity extends IUserRole>(
  name: string,
  dto: new () => TDto,
  roles: IEndpointUserRoles,
  realms?: string[],
): new (service: UserRoleService<TEntity, TDto>, mapper: CrudMapper<TEntity, TDto>) => IUserRoleController<TDto> {
  @ApiUseTags(name)
  @Roles(...roles.default)
  class UserRoleController extends CrudControllerFactory<TDto, TEntity>(name, dto, roles, realms)
    implements IUserRoleController<TDto> {
    constructor(
      protected readonly service: UserRoleService<TEntity, TDto>,
      protected readonly mapper: UserRoleMapper<TEntity, TDto>,
    ) {
      super(service, mapper);
    }
  }

  return UserRoleController;
}
