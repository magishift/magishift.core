import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  getRepository as _getRepository,
  ManyToOne,
  Repository,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../auth/account/account.entity';
import { SessionUtil } from '../auth/session.util';
import { BaseEntity } from '../base/base.entity';
import { DataStatus } from '../base/interfaces/base.interface';
import { ICrudEntity } from './interfaces/crud.interface';

export abstract class CrudEntity extends BaseEntity implements ICrudEntity {
  @ManyToOne(_ => Account, account => account.id)
  createdBy: Account;

  @ManyToOne(_ => Account, account => account.id)
  updatedBy: Account;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({
    type: 'text',
    nullable: true,
    default: DataStatus.Submitted,
  })
  _dataStatus: DataStatus = DataStatus.Submitted;

  @ManyToOne(_ => Account, account => account.id, { nullable: true })
  _dataOwner: Account;

  getRepository(): Repository<ICrudEntity> {
    return _getRepository(this.constructor.name);
  }

  @BeforeUpdate()
  protected beforeUpdate(): void {
    this.updatedBy = { id: SessionUtil.getAccountId } as Account;

    delete this.updatedAt;
  }

  @BeforeInsert()
  protected beforeInsert(): void {
    this.createdBy = { id: SessionUtil.getAccountId } as Account;

    this._dataOwner = this._dataOwner || this.createdBy;

    delete this.createdAt;
  }
}
