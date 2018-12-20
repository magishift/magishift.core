import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { INotification } from './interfaces/notification.interface';

@Entity()
export class Notification extends CrudEntity implements INotification {
  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  title: string;

  @Column()
  message: string;
}
