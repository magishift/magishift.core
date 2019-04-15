import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../../../src/auth/role/defaultRoles';
import { ResolverFactory } from '../../../../../src/crud/crud.resolver';
import { PARTICIPANT_ENDPOINT } from './interfaces/participant.const';
import { IParticipant, IParticipantDto } from './interfaces/participant.interface';
import { ParticipantMapper } from './participant.mapper';
import { ParticipantService } from './participant.service';

@Resolver(PARTICIPANT_ENDPOINT)
export class ParticipantResolver extends ResolverFactory<IParticipantDto, IParticipant>(PARTICIPANT_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: ParticipantService,
    protected readonly mapper: ParticipantMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
