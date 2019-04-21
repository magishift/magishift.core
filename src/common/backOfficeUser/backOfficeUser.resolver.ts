import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../auth/role/defaultRoles';
import { IUser, IUserDto } from '../../user/interfaces/user.interface';
import { UserResolverFactory } from '../../user/user.resolver';
import { BackOfficeUserDto } from './backOfficeUser.dto';
import { BackOfficeUserMapper } from './backOfficeUser.mapper';
import { BackOfficeUserService } from './backOfficeUser.service';
import { BO_USER_ENDPOINT, BO_USER_REALM } from './interfaces/backOfficeUser.const';

@Resolver()
export class BackOfficeUserResolver extends UserResolverFactory<IUserDto, IUser>(
  BO_USER_ENDPOINT,
  BackOfficeUserDto,
  {
    default: [DefaultRoles.admin],
  },
  [BO_USER_REALM],
) {
  constructor(
    protected readonly service: BackOfficeUserService,
    protected readonly mapper: BackOfficeUserMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
