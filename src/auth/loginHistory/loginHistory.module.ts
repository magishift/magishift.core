import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginHistoryController } from './loginHistory.controller';
import { LoginHistory } from './loginHistory.entity';
import { LoginHistoryMapper } from './loginHistory.mapper';
import { LoginHistoryService } from './loginHistory.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LoginHistory])],
  providers: [LoginHistoryService, LoginHistoryMapper],
  controllers: [LoginHistoryController],
  exports: [LoginHistoryService, LoginHistoryMapper],
})
export class LoginHistoryModule {}
