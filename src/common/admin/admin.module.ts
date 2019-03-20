import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { DraftModule } from '../../crud/draft/draft.module';
import { PubSubProvider } from '../../crud/providers/pubSub.provider';
import { FileStorageModule } from '../../fileStorage/fileStorage.module';
import { AdminController } from './admin.controller';
import { Admin } from './admin.entity';
import { AdminMapper } from './admin.mapper';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), FileStorageModule, DraftModule, AuthModule],
  providers: [AdminService, AdminResolver, AdminMapper, PubSubProvider],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
