import { BeforeInsert, BeforeUpdate, Column, getRepository, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { DataHistoryAction, ICrudEntity, IDataMeta } from './interfaces/crud.interface';

export abstract class CrudEntity implements ICrudEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ default: false })
  isDeleted?: boolean;

  @Column({ type: 'simple-json', nullable: true })
  __meta: IDataMeta = {};

  getRepository(): Repository<ICrudEntity> {
    return getRepository(this.constructor.name);
  }

  @BeforeInsert()
  protected beforeInsert(): void {
    this.__meta.histories = [];
    this.__meta.histories.push({
      action: DataHistoryAction.Created,
      date: new Date(),
      by: null,
    });
  }

  @BeforeUpdate()
  protected beforeUpdate(): void {
    this.__meta.histories = this.__meta.histories || [];
    this.__meta.histories.push({
      action: DataHistoryAction.Updated,
      date: new Date(),
      by: null,
    });
  }
}
