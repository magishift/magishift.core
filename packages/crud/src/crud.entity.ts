import { BaseEntity, DataStatus } from '@magishift/base';
import { BeforeInsert, BeforeUpdate, Column, getRepository, Repository } from 'typeorm';
import { ICrudEntity, IDataMeta } from './interfaces/crud.interface';

export abstract class CrudEntity extends BaseEntity implements ICrudEntity {
  @Column({ type: 'simple-json', nullable: true })
  __meta: IDataMeta = {};

  @Column({ default: false })
  isDeleted?: boolean;

  @Column()
  createdAt: Date;

  getRepository(): Repository<ICrudEntity> {
    return getRepository(this.constructor.name);
  }

  @BeforeUpdate()
  protected beforeUpdate(): void {
    this.__meta.histories = this.__meta.histories || [];

    this.createdAt = new Date();
  }

  @BeforeInsert()
  protected beforeInsert(): void {
    this.__meta.histories = [];
    this.__meta.dataStatus = this.__meta.dataStatus || DataStatus.Submitted;

    this.createdAt = new Date();
  }
}
