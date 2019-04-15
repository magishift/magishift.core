import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { IUser, IUserDto } from '../../../../src/user/interfaces/user.interface';
import { UserResolverFactory } from '../../../../src/user/user.resolver';
import { VENDOR_USER_ENDPOINT } from './interfaces/vendorUser.const';
import { VendorUserMapper } from './vendorUser.mapper';
import { VendorUserService } from './vendorUser.service';

@Resolver(VENDOR_USER_ENDPOINT)
export class VendorUserResolver extends UserResolverFactory<IUserDto, IUser>(VENDOR_USER_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: VendorUserService,
    protected readonly mapper: VendorUserMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
