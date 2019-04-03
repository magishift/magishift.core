import { Inject, UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { RolesGuard } from '../../../src/auth/role/roles.guard';
import { ResolverFactory } from '../../../src/crud/crud.resolver';
import { TENANT_ENDPOINT } from './interfaces/tenant.const';
import { ITenant, ITenantDto } from './interfaces/tenant.interface';
import { TenantMapper } from './tenant.mapper';
import { TenantService } from './tenant.service';

@UseGuards(RolesGuard)
@Resolver(TENANT_ENDPOINT)
export class TenantResolver extends ResolverFactory<ITenantDto, ITenant>(TENANT_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: TenantService,
    protected readonly mapper: TenantMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
