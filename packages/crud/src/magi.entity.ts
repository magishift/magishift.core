import { BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { IMagiEntity } from './interfaces/magi.interface';
import { DataHistoryAction, DataMeta } from './types/magi.type';

export abstract class MagiEntity implements IMagiEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ unique: true })
  alias: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'simple-json', nullable: true })
  __meta: DataMeta = {};

  @BeforeInsert()
  protected beforeInsert(): void {
    this.__meta.histories = [];
    this.__meta.histories.push({
      action: DataHistoryAction.Created,
      date: new Date(),
      by: null,
    });

    this.alias = this.id;
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
