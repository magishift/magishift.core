import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from '../../crud/draft/draft.module';
import { PubSubProvider } from '../../crud/providers/pubSub.provider';
import { KeycloakAdminService } from '../keycloak/keycloakAdmin.service';
import { Account } from './account.entity';
import { AccountMapper } from './account.mapper';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Account]), DraftModule],
  providers: [AccountService, AccountMapper, AccountResolver, PubSubProvider, KeycloakAdminService],
  exports: [AccountService, AccountMapper],
})
export class AccountModule {}
