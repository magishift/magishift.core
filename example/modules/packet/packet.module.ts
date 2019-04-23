import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../src/auth/auth.module';
import { DraftModule } from '../../../src/crud/draft/draft.module';
import { PubSubProvider } from '../../../src/crud/providers/pubSub.provider';
import { FileStorageModule } from '../../../src/fileStorage/fileStorage.module';
import { PacketController } from './packet.controller';
import { Packet } from './packet.entity';
import { PacketMapper } from './packet.mapper';
import { PacketResolver } from './packet.resolver';
import { PacketService } from './packet.service';
import { TenderModule } from './tender/tender.module';

@Module({
  imports: [TypeOrmModule.forFeature([Packet]), FileStorageModule, DraftModule, AuthModule, TenderModule],
  providers: [PacketService, PacketResolver, PacketMapper, PubSubProvider, PubSubProvider],
  controllers: [PacketController],
  exports: [PacketService],
})
export class PacketModule {}
