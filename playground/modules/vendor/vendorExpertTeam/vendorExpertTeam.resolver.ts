import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { ResolverFactory } from '../../../../src/crud/crud.resolver';
import { VENDOR_ENDPOINT } from '../interfaces/vendor.const';
import { IVendorExpertTeam, IVendorExpertTeamDto } from './interfaces/vendorExpertTeam.interface';
import { VendorExpertTeamMapper } from './vendorExpertTeam.mapper';
import { VendorExpertTeamService } from './vendorExpertTeam.service';

@Resolver(VENDOR_ENDPOINT)
export class VendorExpertTeamResolver extends ResolverFactory<IVendorExpertTeamDto, IVendorExpertTeam>(
  VENDOR_ENDPOINT,
  {
    default: [DefaultRoles.authenticated],
  },
) {
  constructor(
    protected readonly service: VendorExpertTeamService,
    protected readonly mapper: VendorExpertTeamMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
