import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../src/auth/auth.module';
import { KeycloakService } from '../../../src/auth/keycloak/keycloak.service';
import { DraftModule } from '../../../src/crud/draft/draft.module';
import { PubSubProvider } from '../../../src/crud/providers/pubSub.provider';
import { FileStorageModule } from '../../../src/fileStorage/fileStorage.module';
import { VendorController } from './vendor.controller';
import { Vendor } from './vendor.entity';
import { VendorMapper } from './vendor.mapper';
import { VendorResolver } from './vendor.resolver';
import { VendorService } from './vendor.service';
import { VendorExpertTeamController } from './vendorExpertTeam/vendorExpertTeam.controller';
import { VendorExpertTeam } from './vendorExpertTeam/vendorExpertTeam.entity';
import { VendorExpertTeamMapper } from './vendorExpertTeam/vendorExpertTeam.mapper';
import { VendorExpertTeamResolver } from './vendorExpertTeam/vendorExpertTeam.resolver';
import { VendorExpertTeamService } from './vendorExpertTeam/vendorExpertTeam.service';
import { VendorUserController } from './vendorUser/vendorUser.controller';
import { VendorUser } from './vendorUser/vendorUser.entity';
import { VendorUserMapper } from './vendorUser/vendorUser.mapper';
import { VendorUserResolver } from './vendorUser/vendorUser.resolver';
import { VendorUserService } from './vendorUser/vendorUser.service';
import { VendorUserRoleController } from './vendorUser/vendorUserRole/vendorUserRole.controller';
import { VendorUserRole } from './vendorUser/vendorUserRole/vendorUserRole.entity';
import { VendorUserRoleMapper } from './vendorUser/vendorUserRole/vendorUserRole.mapper';
import { VendorUserRoleService } from './vendorUser/vendorUserRole/vendorUserRole.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor]),
    TypeOrmModule.forFeature([VendorUser]),
    TypeOrmModule.forFeature([VendorUserRole]),
    TypeOrmModule.forFeature([VendorExpertTeam]),
    FileStorageModule,
    DraftModule,
    AuthModule,
  ],
  providers: [
    VendorService,
    VendorResolver,
    VendorMapper,
    PubSubProvider,
    VendorUserService,
    VendorUserResolver,
    VendorUserMapper,
    VendorUserRoleService,
    VendorUserRoleMapper,
    PubSubProvider,
    KeycloakService,
    VendorExpertTeamResolver,
    VendorExpertTeamService,
    VendorExpertTeamMapper,
  ],
  controllers: [VendorController, VendorUserController, VendorUserRoleController, VendorExpertTeamController],
  exports: [VendorService, VendorUserService, VendorUserRoleService, VendorExpertTeamService],
})
export class VendorModule {}
