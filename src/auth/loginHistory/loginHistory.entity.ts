import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { Account } from '../account/account.entity';
import { ILoginHistory } from './interfaces/loginHistory.interface';

@Entity()
export class LoginHistory extends CrudEntity implements ILoginHistory {
  @ManyToOne(_ => Account, account => account.loginHistories, { onDelete: 'CASCADE' })
  account: Account;

  @Column({ nullable: true })
  loginTime: Date;

  @Column({ nullable: true })
  sessionId: string;

  @Column({ type: 'simple-array', nullable: true, default: [] })
  actions: string[] = [];

  // hide Account and updatedBy
  createdBy: Account;

  updatedBy: Account;

  @BeforeUpdate()
  protected beforeUpdate(): void {
    this.updatedBy = null;
  }

  @BeforeInsert()
  protected beforeInsert(): void {
    this.createdBy = null;
  }
}
