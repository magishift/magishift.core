import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from '../../crud/draft/draft.module';
import { AuthModule } from '../auth.module';
import { KeycloakAdminService } from '../keycloak/keycloakAdmin.service';
import { RoleController } from './role.controller';
import { Role } from './role.entity';
import { RoleMapper } from './Role.mapper';
import { RoleService } from './role.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role]), AuthModule, DraftModule],
  providers: [RoleService, RoleMapper, KeycloakAdminService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
