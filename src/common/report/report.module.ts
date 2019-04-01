import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DraftModule } from '../crud/draft/draft.module';
import { PubSubProvider } from '../crud/providers/pubSub.provider';
import { FileStorageModule } from '../fileStorage/fileStorage.module';
import { ReportController } from './report.controller';
import { Report } from './report.entity';
import { ReportMapper } from './report.mapper';
import { ReportResolver } from './report.resolver';
import { ReportService } from './report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), FileStorageModule, DraftModule, AuthModule],
  providers: [ReportService, ReportResolver, ReportMapper, PubSubProvider],
  controllers: [ReportController],
  exports: [ReportService],
})
export class ReportModule {}
