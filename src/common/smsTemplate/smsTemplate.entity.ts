import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { ISmsTemplate } from './interfaces/smsTemplate.interface';

@Entity()
export class SmsTemplate extends CrudEntity implements ISmsTemplate {
  @Column({ unique: true })
  type: string;

  @Column()
  template: string;
}
