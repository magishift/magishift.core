import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { CrudResolverFactory } from '../../../src/crud/crud.resolver';
import { PACKET_ENDPOINT } from './interfaces/packet.const';
import { IPacket, IPacketDto } from './interfaces/packet.interface';
import { PacketDto } from './packet.dto';
import { PacketMapper } from './packet.mapper';
import { PacketService } from './packet.service';

@Resolver()
export class PacketResolver extends CrudResolverFactory<IPacketDto, IPacket>(PACKET_ENDPOINT, PacketDto, {
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
