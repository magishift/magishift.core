import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../../auth/account/account.module';
import { DraftModule } from '../../crud/draft/draft.module';
import { PubSubProvider } from '../../crud/providers/pubSub.provider';
import { FileStorageModule } from '../../fileStorage/fileStorage.module';
import { HttpModule } from '../../http/http.module';
import { AdminController } from './admin.controller';
import { Admin } from './admin.entity';
import { AdminMapper } from './admin.mapper';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), HttpModule, FileStorageModule, AccountModule, DraftModule],
  providers: [AdminService, AdminResolver, AdminMapper, PubSubProvider],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
