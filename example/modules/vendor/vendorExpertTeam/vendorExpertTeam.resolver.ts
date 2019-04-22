import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { CrudResolverFactory } from '../../../../src/crud/crud.resolver';
import { VENDOR_EXPERT_TEAM_ENDPOINT } from './interfaces/vendorExpertTeam.const';
import { IVendorExpertTeam, IVendorExpertTeamDto } from './interfaces/vendorExpertTeam.interface';
import { VendorExpertTeamDto } from './vendorExpertTeam.dto';
import { VendorExpertTeamMapper } from './vendorExpertTeam.mapper';
import { VendorExpertTeamService } from './vendorExpertTeam.service';

@Resolver()
export class VendorExpertTeamResolver extends CrudResolverFactory<IVendorExpertTeamDto, IVendorExpertTeam>(
  VENDOR_EXPERT_TEAM_ENDPOINT,
  VendorExpertTeamDto,
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
