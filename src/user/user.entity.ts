import { Column, ManyToOne, OneToMany } from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { FileStorage } from '../fileStorage/fileStorage.entity';
import { Device } from './device/device.entity';
import { IUser } from './interfaces/user.interface';
import { Notification } from './notification/notification.entity';
import { IUserRole } from './userRole/interfaces/userRole.interface';

export abstract class User extends CrudEntity implements IUser {
  @Column()
  accountId: string;

  @Column()
  username: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: true })
  emailVerified: boolean;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column()
  realm: string;

  @ManyToOne(_ => FileStorage, fileStorage => fileStorage.ownerId, { onDelete: 'RESTRICT' })
  photo: FileStorage;

  @OneToMany(_ => Notification, notification => notification.from)
  notificationsSendTo: Notification[];

  @OneToMany(_ => Notification, notification => notification.from)
  notificationsSendFrom: Notification[];

  @OneToMany(_ => Device, device => device.ownerId)
  devices: Device[];

  abstract realmRoles: IUserRole[];
}
