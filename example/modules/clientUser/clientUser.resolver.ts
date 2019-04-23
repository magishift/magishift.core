import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { UserResolverFactory } from '../../../src/user/user.resolver';
import { ClientUserDto } from './clientUser.dto';
import { ClientUserMapper } from './clientUser.mapper';
import { ClientUserService } from './clientUser.service';
import { CLIENT_USER_ENDPOINT } from './interfaces/clientUser.const';
import { IClientUser, IClientUserDto } from './interfaces/clientUser.interface';

@Resolver()
export class ClientUserResolver extends UserResolverFactory<IClientUserDto, IClientUser>(
  CLIENT_USER_ENDPOINT,
  ClientUserDto,
  {
    default: [DefaultRoles.admin],
  },
) {
  constructor(
    protected readonly service: ClientUserService,
    protected readonly mapper: ClientUserMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
