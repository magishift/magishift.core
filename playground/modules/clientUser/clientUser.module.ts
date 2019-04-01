import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../src/auth/auth.module';
import { KeycloakAdminService } from '../../../src/auth/keycloak/keycloakAdmin.service';
import { DraftModule } from '../../../src/crud/draft/draft.module';
import { PubSubProvider } from '../../../src/crud/providers/pubSub.provider';
import { FileStorageModule } from '../../../src/fileStorage/fileStorage.module';
import { ClientUserController } from './clientUser.controller';
import { ClientUser } from './clientUser.entity';
import { ClientUserMapper } from './clientUser.mapper';
import { ClientUserResolver } from './clientUser.resolver';
import { ClientUserService } from './clientUser.service';
import { ClientUserRoleController } from './clientUserRole/clientUserRole.controller';
import { ClientUserRole } from './clientUserRole/clientUserRole.entity';
import { ClientUserRoleMapper } from './clientUserRole/clientUserRole.mapper';
import { ClientUserRoleService } from './clientUserRole/clientUserRole.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientUser]),
    TypeOrmModule.forFeature([ClientUserRole]),
    FileStorageModule,
    DraftModule,
    AuthModule,
  ],
  providers: [
    ClientUserService,
    ClientUserResolver,
    ClientUserMapper,
    ClientUserRoleService,
    ClientUserRoleMapper,
    PubSubProvider,
    KeycloakAdminService,
  ],
  controllers: [ClientUserController, ClientUserRoleController],
  exports: [ClientUserService, ClientUserRoleService],
})
export class ClientUserModule {}
