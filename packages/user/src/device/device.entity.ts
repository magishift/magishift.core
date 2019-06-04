import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { IDevice } from './interfaces/device.interface';

@Entity()
export class Device extends CrudEntity implements IDevice {
  @Column()
  ownerId: string;

  @Column({ unique: true })
  deviceFcmToken: string;

  @Column({ type: 'json' })
  deviceInfo: string;
}
