import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { KeycloakService } from '../../auth/keycloak/keycloak.service';
import { DraftModule } from '../../crud/draft/draft.module';
import { PubSubProvider } from '../../crud/providers/pubSub.provider';
import { DateScalar } from '../../crud/scalars/date.scalar';
import { FileStorageModule } from '../../fileStorage/fileStorage.module';
import { BackOfficeRoleController } from './backOfficeRole/backOfficeRole.controller';
import { BackOfficeRole } from './backOfficeRole/backOfficeRole.entity';
import { BackOfficeRoleMapper } from './backOfficeRole/backOfficeRole.mapper';
import { BackOfficeRoleResolver } from './backOfficeRole/backOfficeRole.resolver';
import { BackOfficeRoleService } from './backOfficeRole/backOfficeRole.service';
import { BackOfficeUserController } from './backOfficeUser.controller';
import { BackOfficeUser } from './backOfficeUser.entity';
import { BackOfficeUserMapper } from './backOfficeUser.mapper';
import { BackOfficeUserResolver } from './backOfficeUser.resolver';
import { BackOfficeUserService } from './backOfficeUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([BackOfficeUser, BackOfficeRole]), FileStorageModule, DraftModule, AuthModule],
  providers: [
    BackOfficeUserService,
    BackOfficeUserResolver,
    BackOfficeUserMapper,
    BackOfficeRoleService,
    BackOfficeRoleResolver,
    BackOfficeRoleMapper,
    KeycloakService,
    DateScalar,
    PubSubProvider,
  ],
  controllers: [BackOfficeUserController, BackOfficeRoleController],
  exports: [BackOfficeUserService, BackOfficeRoleService],
})
export class BackOfficeUserModule {}
