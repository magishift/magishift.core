import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../crud/crud.mapper';
import { DeviceDto } from './device.dto';
import { Device } from './device.entity';
import { IDevice, IDeviceDto } from './interfaces/device.interface';

@Injectable()
export class DeviceMapper extends CrudMapper<IDevice, IDeviceDto> {
  constructor() {
    super(Device, DeviceDto);
  }
}
