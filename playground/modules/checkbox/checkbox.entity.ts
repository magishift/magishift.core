import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../../src/crud/crud.entity';
import { ICheckbox } from './interfaces/checkbox.interface';

@Entity()
export class Checkbox extends CrudEntity implements ICheckbox {
  @Column({ nullable: true })
  data: string;
}
