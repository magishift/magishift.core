import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from '../../crud/draft/draft.module';
import { HttpModule } from '../../http/http.module';
import { Account } from './account.entity';
import { AccountMapper } from './account.mapper';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Account]), HttpModule, DraftModule],
  providers: [AccountService, AccountMapper, AccountResolver],
  exports: [AccountService, AccountMapper],
})
export class AccountModule {}
