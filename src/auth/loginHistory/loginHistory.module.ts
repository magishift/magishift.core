import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginHistory } from './loginHistory.entity.mongo';
import { LoginHistoryService } from './loginHistory.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LoginHistory], 'mongodb')],
  providers: [LoginHistoryService],
  exports: [LoginHistoryService],
})
export class LoginHistoryModule {}
