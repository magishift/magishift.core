import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { ISession } from './interfaces/session.interface';

@Entity()
export class Session extends BaseEntity implements ISession {
  @Column({ unique: true })
  accountId: string;

  @Column({ unique: true })
  token: string;

  @Column()
  expireOn: string;

  createdBy: string;

  updatedBy: string;
}
