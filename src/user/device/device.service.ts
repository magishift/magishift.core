import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { CrudService } from '../../crud/crud.service';
import { DraftService } from '../../crud/draft/draft.service';
import { Device } from './device.entity';
import { DeviceMapper } from './device.mapper';
import { IDevice, IDeviceDto } from './interfaces/device.interface';

@Injectable()
export class DeviceService extends CrudService<IDevice, IDeviceDto> {
  constructor(
    @InjectRepository(Device) protected readonly repository: Repository<Device>,
    protected readonly draftService: DraftService,
    protected readonly mapper: DeviceMapper,
  ) {
    super(repository, draftService, mapper, false);
  }
}
