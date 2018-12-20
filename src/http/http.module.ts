import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { HttpService } from './http.service';

@Module({
  imports: [ConfigModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
