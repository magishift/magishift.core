import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { ResolverFactory } from '../../../../src/crud/crud.resolver';
import { TENDER_ENDPOINT } from './interfaces/tender.const';
import { ITender, ITenderDto } from './interfaces/tender.interface';
import { TenderMapper } from './tender.mapper';
import { TenderService } from './tender.service';

@Resolver(TENDER_ENDPOINT)
export class TenderResolver extends ResolverFactory<ITenderDto, ITender>(TENDER_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: TenderService,
    protected readonly mapper: TenderMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
