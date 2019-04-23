import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../src/auth/auth.module';
import { DraftModule } from '../../../src/crud/draft/draft.module';
import { PubSubProvider } from '../../../src/crud/providers/pubSub.provider';
import { FileStorageModule } from '../../../src/fileStorage/fileStorage.module';
import { TenantController } from './tenant.controller';
import { Tenant } from './tenant.entity';
import { TenantMapper } from './tenant.mapper';
import { TenantResolver } from './tenant.resolver';
import { TenantService } from './tenant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), FileStorageModule, DraftModule, AuthModule],
  providers: [TenantService, TenantResolver, TenantMapper, PubSubProvider],
  controllers: [TenantController],
  exports: [TenantService],
})
export class TenantModule {}
