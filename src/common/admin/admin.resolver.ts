import { Inject, UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthService } from '../../auth/auth.service';
import { DefaultRoles } from '../../auth/role/role.const';
import { RolesGuard } from '../../auth/role/roles.guard';
import { HttpService } from '../../http/http.service';
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
  constructor(
    protected readonly service: AdminService,
    protected readonly authService: AuthService,
    protected readonly mapper: AdminMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
    protected readonly http: HttpService,
  ) {
    super(service, authService, mapper, pubSub, http);
  }
}
