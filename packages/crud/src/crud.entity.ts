import { SessionUtil } from '@magishift/auth';
import { BaseEntity, DataStatus } from '@magishift/base';
import { BeforeInsert, BeforeUpdate, Column, getRepository as _getRepository, Repository } from 'typeorm';
import { ICrudEntity, IDataMeta } from './interfaces/crud.interface';

export abstract class CrudEntity extends BaseEntity implements ICrudEntity {
  @Column({ type: 'simple-json', nullable: true })
  __meta: IDataMeta = {};

  @Column({ default: false })
  isDeleted?: boolean;

  getRepository(): Repository<ICrudEntity> {
    return _getRepository(this.constructor.name);
  }

  @BeforeUpdate()
  protected beforeUpdate(): void {
    this.__meta.histories = this.__meta.histories || [];
    this.__meta.histories.push({ date: new Date(), action: 'updated', by: SessionUtil.getAccountId });
  }

  @BeforeInsert()
  protected beforeInsert(): void {
    this.__meta.histories = [];
    this.__meta.histories.push({ date: new Date(), action: 'created', by: SessionUtil.getAccountId });
    this.__meta.dataStatus = this.__meta.dataStatus || DataStatus.Submitted;
    this.__meta.dataOwner = SessionUtil.getAccountId;
  }
}
