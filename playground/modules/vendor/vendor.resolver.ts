import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { ResolverFactory } from '../../../src/crud/crud.resolver';
import { VENDOR_ENDPOINT } from './interfaces/vendor.const';
import { IVendor, IVendorDto } from './interfaces/vendor.interface';
import { VendorMapper } from './vendor.mapper';
import { VendorService } from './vendor.service';

@Resolver(VENDOR_ENDPOINT)
export class VendorResolver extends ResolverFactory<IVendorDto, IVendor>(VENDOR_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: VendorService,
    protected readonly mapper: VendorMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
