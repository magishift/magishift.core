import { Inject, UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { RolesGuard } from '../../../src/auth/role/roles.guard';
import { IUser, IUserDto } from '../../../src/user/interfaces/user.interface';
import { UserResolverFactory } from '../../../src/user/user.resolver';
import { ClientUserMapper } from './clientUser.mapper';
import { ClientUserService } from './clientUser.service';
import { CLIENT_USER_ENDPOINT } from './interfaces/clientUser.const';

@UseGuards(RolesGuard)
@Resolver(CLIENT_USER_ENDPOINT)
export class ClientUserResolver extends UserResolverFactory<IUserDto, IUser>(CLIENT_USER_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: ClientUserService,
    protected readonly mapper: ClientUserMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
