import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { PACKET_ENDPOINT } from './interfaces/packet.const';
import { IPacket, IPacketDto } from './interfaces/packet.interface';
import { PacketDto } from './packet.dto';
import { PacketMapper } from './packet.mapper';
import { PacketService } from './packet.service';

@Controller(PACKET_ENDPOINT)
export class PacketController extends CrudControllerFactory<IPacketDto, IPacket>(PACKET_ENDPOINT, PacketDto, {
  default: [DefaultRoles.admin],
}) {
  constructor(protected readonly service: PacketService, protected readonly mapper: PacketMapper) {
    super(service, mapper);
  }
}
