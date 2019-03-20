import { Inject, UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthService } from '../../auth/auth.service';
import { DefaultRoles } from '../../auth/role/role.const';
import { RolesGuard } from '../../auth/role/roles.guard';
import { IUser, IUserDto } from '../../user/interfaces/user.interface';
import { UserResolverFactory } from '../../user/user.resolver';
import { AdminMapper } from './admin.mapper';
import { AdminService } from './admin.service';
import { ADMIN_ENDPOINT } from './interfaces/admin.const';

@UseGuards(RolesGuard)
@Resolver(ADMIN_ENDPOINT)
export class AdminResolver extends UserResolverFactory<IUserDto, IUser>(ADMIN_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: AdminService,
    protected readonly authService: AuthService,
    protected readonly mapper: AdminMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, authService, mapper, pubSub);
  }
}
