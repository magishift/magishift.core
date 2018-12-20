import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceController } from './device.controller';
import { Device } from './device.entity';
import { DeviceMapper } from './device.mapper';
import { DeviceService } from './device.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DeviceService, DeviceMapper],
  controllers: [DeviceController],
  exports: [DeviceService, DeviceMapper],
})
export class DeviceModule {}
