import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu/menu.utils';
import { SettingController } from './setting.controller';
import { Setting } from './setting.entity.mongo';
import { SettingService } from './setting.service';

@Global()
@Module({
  imports: [Menu, TypeOrmModule.forFeature([Setting], 'mongodb')],
  providers: [SettingService],
  controllers: [SettingController],
  exports: [Menu, SettingService],
})
export class SettingModule {}
