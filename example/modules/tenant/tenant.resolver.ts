import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { CrudResolverFactory } from '../../../src/crud/crud.resolver';
import { TENANT_ENDPOINT } from './interfaces/tenant.const';
import { ITenant, ITenantDto } from './interfaces/tenant.interface';
import { TenantDto } from './tenant.dto';
import { TenantMapper } from './tenant.mapper';
import { TenantService } from './tenant.service';

@Resolver()
export class TenantResolver extends CrudResolverFactory<ITenantDto, ITenant>(TENANT_ENDPOINT, TenantDto, {
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
