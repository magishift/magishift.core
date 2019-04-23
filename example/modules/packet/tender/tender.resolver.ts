import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { CrudResolverFactory } from '../../../../src/crud/crud.resolver';
import { TENDER_ENDPOINT } from './interfaces/tender.const';
import { ITender, ITenderDto } from './interfaces/tender.interface';
import { TenderDto } from './tender.dto';
import { TenderMapper } from './tender.mapper';
import { TenderService } from './tender.service';

@Resolver()
export class TenderResolver extends CrudResolverFactory<ITenderDto, ITender>(TENDER_ENDPOINT, TenderDto, {
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
