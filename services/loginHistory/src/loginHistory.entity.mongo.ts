import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { ILoginHistory } from './interfaces/loginHistory.interface';

@Entity()
export class LoginHistory extends CrudEntity implements ILoginHistory {
  @ObjectIdColumn()
  id: string;

  @Column()
  accountId: string;

  @Column({ nullable: true })
  sessionId: string;

  @Column({ type: 'simple-array', nullable: true, default: [] })
  actions: string[] = [];

  constructor(init?: Partial<LoginHistory>) {
    super();
    Object.assign(this, init);
  }
}
