import { Module } from '@nestjs/common';
import { SettingModule } from '../../setting/setting.module';
import { GoogleConfigController } from './google.controller';
import { GoogleConfigDto } from './google.dto';
import { GoogleConfigService } from './google.service';

@Module({
  imports: [SettingModule],
  providers: [GoogleConfigService, GoogleConfigDto],
  controllers: [GoogleConfigController],
  exports: [GoogleConfigService],
})
export class GoogleConfigModule {}
