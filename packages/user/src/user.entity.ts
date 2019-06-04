import { Column, ManyToOne, OneToMany } from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { FileStorage } from '../fileStorage/fileStorage.entity';
import { Device } from './device/device.entity';
import { IUser } from './interfaces/user.interface';
import { Notification } from './notification/notification.entity';
import { IUserRole } from './userRole/interfaces/userRole.interface';

export abstract class User extends CrudEntity implements IUser {
  @Column({ unique: true })
  accountId: string;

  @Column({ unique: true })
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

  @ManyToOne(() => FileStorage, fileStorage => fileStorage.ownerId, { onDelete: 'RESTRICT' })
  photo: FileStorage;

  @OneToMany(() => Notification, notification => notification.from)
  notificationsSendTo: Notification[];

  @OneToMany(() => Notification, notification => notification.from)
  notificationsSendFrom: Notification[];

  @OneToMany(() => Device, device => device.ownerId)
  devices: Device[];

  abstract realmRoles: IUserRole[];
}
