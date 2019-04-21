import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../../src/crud/crud.service';
import { DraftService } from '../../../src/crud/draft/draft.service';
import { IPacket, IPacketDto } from './interfaces/packet.interface';
import { Packet } from './packet.entity';
import { PacketMapper } from './packet.mapper';

@Injectable()
export class PacketService extends CrudService<IPacket, IPacketDto> {
  constructor(
    @InjectRepository(Packet) protected readonly repository: Repository<Packet>,
    protected readonly mapper: PacketMapper,
    protected readonly draftService: DraftService,
  ) {
    super(repository, draftService, mapper);
  }
}
