import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../../src/crud/crud.entity';
import { IPicker } from './interfaces/picker.interface';

@Entity()
export class Picker extends CrudEntity implements IPicker {
  @Column({ nullable: true })
  data: string;
}
