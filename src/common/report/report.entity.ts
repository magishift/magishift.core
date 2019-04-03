import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { IReport } from './interfaces/report.interface';

@Entity()
export class Report extends CrudEntity implements IReport {
  @Column({ nullable: true })
  index: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  authorization: string;

  @Column({ default: 'GET' })
  method: 'GET' | 'POST';
}
