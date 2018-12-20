import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account/account.entity';
import { AuthService } from './auth.service';
import { LoginHistoryModule } from './loginHistory/loginHistory.module';
import { Session } from './session.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Session, Account]), LoginHistoryModule],
  providers: [AuthService],
  exports: [AuthService, LoginHistoryModule],
})
export class AuthModule {}
