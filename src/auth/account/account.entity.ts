import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DataStatus } from '../../base/interfaces/base.interface';
import { CrudEntity } from '../../crud/crud.entity';
import { LoginHistory } from '../loginHistory/loginHistory.entity';
import { IAccount } from './interfaces/account.interface';

@Entity()
export class Account extends CrudEntity implements IAccount {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: false })
  isActive: boolean = false;

  @Column()
  realm: string;

  @Column({ type: 'simple-array', default: [] })
  roles: string[];

  @ManyToOne(_ => Account, account => account.id)
  createdBy: Account;

  @ManyToOne(_ => Account, account => account.id)
  updatedBy: Account;

  @Column({ default: false })
  isDeleted: boolean = false;

  @Column({ default: DataStatus.Submitted })
  _dataStatus: DataStatus;

  @OneToMany(_ => LoginHistory, loginHistory => loginHistory.account)
  loginHistories: LoginHistory[];
}
