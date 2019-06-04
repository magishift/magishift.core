import { CrudDto } from '../../crud/crud.dto';
import { Form } from '../../crud/form.decorator';
import { Grid } from '../../crud/grid.decorator';
import { IUserDto } from '../interfaces/user.interface';
import { IDeviceDto } from './interfaces/device.interface';

@Form()
@Grid()
export class DeviceDto extends CrudDto implements IDeviceDto {
  user: IUserDto;

  deviceFcmToken: string;

  deviceInfo: string;
}
