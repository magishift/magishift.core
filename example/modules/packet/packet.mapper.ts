import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../../src/crud/crud.mapper';
import { IPacket, IPacketDto } from './interfaces/packet.interface';
import { PacketDto } from './packet.dto';
import { Packet } from './packet.entity';

@Injectable()
export class PacketMapper extends CrudMapper<IPacket, IPacketDto> {
  constructor() {
    super(Packet, PacketDto);
  }
}
