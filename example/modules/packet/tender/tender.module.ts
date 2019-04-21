import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../../src/auth/auth.module';
import { DraftModule } from '../../../../src/crud/draft/draft.module';
import { PubSubProvider } from '../../../../src/crud/providers/pubSub.provider';
import { FileStorageModule } from '../../../../src/fileStorage/fileStorage.module';
import { ParticipantController } from './participant/participant.controller';
import { Participant } from './participant/participant.entity';
import { ParticipantMapper } from './participant/participant.mapper';
import { ParticipantResolver } from './participant/participant.resolver';
import { ParticipantService } from './participant/participant.service';
import { TenderController } from './tender.controller';
import { Tender } from './tender.entity';
import { TenderMapper } from './tender.mapper';
import { TenderResolver } from './tender.resolver';
import { TenderService } from './tender.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tender]),
    TypeOrmModule.forFeature([Participant]),
    FileStorageModule,
    DraftModule,
    AuthModule,
  ],
  providers: [
    TenderService,
    TenderResolver,
    TenderMapper,
    ParticipantService,
    ParticipantResolver,
    ParticipantMapper,
    PubSubProvider,
  ],
  controllers: [TenderController, ParticipantController],
  exports: [TenderService, ParticipantService],
})
export class TenderModule {}
