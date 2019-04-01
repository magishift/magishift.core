import { Inject, UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../auth/role/defaultRoles';
import { RolesGuard } from '../../auth/role/roles.guard';
import { IUser, IUserDto } from '../../user/interfaces/user.interface';
import { UserResolverFactory } from '../../user/user.resolver';
import { BackOfficeUserMapper } from './backOfficeUser.mapper';
import { BackOfficeUserService } from './backOfficeUser.service';
import { BO_USER_ENDPOINT } from './interfaces/backOfficeUser.const';

@UseGuards(RolesGuard)
@Resolver(BO_USER_ENDPOINT)
export class BackOfficeUserResolver extends UserResolverFactory<IUserDto, IUser>(BO_USER_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: BackOfficeUserService,
    protected readonly mapper: BackOfficeUserMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
