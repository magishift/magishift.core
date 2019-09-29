import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftModule } from '../../crud/draft/draft.module';
import { DeviceController } from './device.controller';
import { Device } from './device.entity';
import { DeviceMapper } from './device.mapper';
import { DeviceService } from './device.service';

@Global()
@Module({
  imports: [DraftModule, TypeOrmModule.forFeature([Device])],
  providers: [DeviceService, DeviceMapper],
  controllers: [DeviceController],
  exports: [DeviceService, DeviceMapper],
})
export class DeviceModule {}
