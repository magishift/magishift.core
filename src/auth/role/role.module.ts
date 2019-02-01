import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from '../../crud/draft/draft.module';
import { PubSubProvider } from '../../crud/providers/pubSub.provider';
import { HttpModule } from '../../http/http.module';
import { RoleController } from './role.controller';
import { Role } from './role.entity';
import { RoleMapper } from './role.mapper';
import { RoleService } from './role.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role]), HttpModule, DraftModule],
  providers: [RoleService, RoleMapper, PubSubProvider],
  controllers: [RoleController],
  exports: [RoleService, RoleMapper],
})
export class RoleModule {}
