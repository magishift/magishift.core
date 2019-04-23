import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../auth/role/defaultRoles';
import { CrudControllerFactory } from '../../crud/crud.controller';
import { DeviceDto } from './device.dto';
import { DeviceMapper } from './device.mapper';
import { DeviceService } from './device.service';
import { DEVICE_ENDPOINT } from './interfaces/device.const';
import { IDevice, IDeviceDto } from './interfaces/device.interface';

@Controller(DEVICE_ENDPOINT)
export class DeviceController extends CrudControllerFactory<IDeviceDto, IDevice>(DEVICE_ENDPOINT, DeviceDto, {
  default: [DefaultRoles.authenticated],
}) {
  constructor(protected readonly service: DeviceService, protected readonly mapper: DeviceMapper) {
    super(service, mapper);
  }
}
