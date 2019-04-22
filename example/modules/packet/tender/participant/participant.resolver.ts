import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../../../src/auth/role/defaultRoles';
import { CrudResolverFactory } from '../../../../../src/crud/crud.resolver';
import { PARTICIPANT_ENDPOINT } from './interfaces/participant.const';
import { IParticipant, IParticipantDto } from './interfaces/participant.interface';
import { ParticipantDto } from './participant.dto';
import { ParticipantMapper } from './participant.mapper';
import { ParticipantService } from './participant.service';

@Resolver()
export class ParticipantResolver extends CrudResolverFactory<IParticipantDto, IParticipant>(
  PARTICIPANT_ENDPOINT,
  ParticipantDto,
  {
    default: [DefaultRoles.admin],
  },
) {
  constructor(
    protected readonly service: ParticipantService,
    protected readonly mapper: ParticipantMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
