import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { UserResolverFactory } from '../../../../src/user/user.resolver';
import { VENDOR_USER_ENDPOINT } from './interfaces/vendorUser.const';
import { IVendorUser, IVendorUserDto } from './interfaces/vendorUser.interface';
import { VendorUserDto } from './vendorUser.dto';
import { VendorUserMapper } from './vendorUser.mapper';
import { VendorUserService } from './vendorUser.service';

@Resolver()
export class VendorUserResolver extends UserResolverFactory<IVendorUserDto, IVendorUser>(
  VENDOR_USER_ENDPOINT,
  VendorUserDto,
  {
    default: [DefaultRoles.admin],
  },
) {
  constructor(
    protected readonly service: VendorUserService,
    protected readonly mapper: VendorUserMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
