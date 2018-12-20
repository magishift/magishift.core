import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../../src/crud/crud.entity';
import { ISelect } from './interfaces/select.interface';

@Entity()
export class Select extends CrudEntity implements ISelect {
  @Column({ nullable: true })
  data: string;
}
