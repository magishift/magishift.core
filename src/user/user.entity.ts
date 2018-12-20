import { Column, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Account } from '../auth/account/account.entity';
import { CrudEntity } from '../crud/crud.entity';
import { FileStorage } from '../fileStorage/fileStorage.entity';
import { Device } from './device/device.entity';
import { IUser } from './interfaces/user.interface';
import { Notification } from './notification/notification.entity';

export abstract class User extends CrudEntity implements IUser {
  @OneToOne(_ => Account, account => account.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: Account;

  @ManyToOne(_ => FileStorage, fileStorage => fileStorage.ownerId, { onDelete: 'CASCADE' })
  photo: FileStorage;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @OneToMany(_ => Notification, notification => notification.from)
  notificationsSendTo: Notification[];

  @OneToMany(_ => Notification, notification => notification.from)
  notificationsSendFrom: Notification[];

  @OneToMany(_ => Device, device => device.ownerId)
  devices: Device[];
}
