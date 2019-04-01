import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { IReport } from './interfaces/report.interface';

@Entity()
export class Report extends CrudEntity implements IReport {
  @Column()
  index: number;

  @Column()
  url: string;

  @Column()
  authorization: string;

  @Column({ default: 'GET' })
  method: 'GET' | 'POST';
}
