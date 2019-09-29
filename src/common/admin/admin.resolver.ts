import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { DefaultRoles } from '../../auth/role/role.const';
import { RolesGuard } from '../../auth/role/roles.guard';
import { UserResolverFactory } from '../../user/user.resolver';
import { AdminMapper } from './admin.mapper';
import { AdminService } from './admin.service';
import { ADMIN_ENDPOINT } from './interfaces/admin.const';
import { IAdmin, IAdminDto } from './interfaces/admin.interface';

@UseGuards(RolesGuard)
@Resolver(ADMIN_ENDPOINT)
export class AdminResolver extends UserResolverFactory<IAdminDto, IAdmin>(ADMIN_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(protected readonly service: AdminService, protected readonly mapper: AdminMapper) {
    super(service, mapper);
  }
}
