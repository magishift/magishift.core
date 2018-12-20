import { Global, Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';

@Global()
@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
