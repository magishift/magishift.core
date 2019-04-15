import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { ResolverFactory } from '../../../src/crud/crud.resolver';
import { PACKET_ENDPOINT } from './interfaces/packet.const';
import { IPacket, IPacketDto } from './interfaces/packet.interface';
import { PacketMapper } from './packet.mapper';
import { PacketService } from './packet.service';

@Resolver(PACKET_ENDPOINT)
export class PacketResolver extends ResolverFactory<IPacketDto, IPacket>(PACKET_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: PacketService,
    protected readonly mapper: PacketMapper,
    @Inject('PubSub') protected readonly pubSub: PubSub,
  ) {
    super(service, mapper, pubSub);
  }
}
