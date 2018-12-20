import { Module } from '@nestjs/common';
import { GoogleConfigModule } from '../google.module';
import { GoogleFcmController } from './googleFcm.controller';
import { GoogleFcmService } from './googleFcm.service';

@Module({
  imports: [GoogleConfigModule],
  providers: [GoogleFcmService],
  controllers: [GoogleFcmController],
  exports: [GoogleFcmService],
})
export class GoogleFcmModule {}
