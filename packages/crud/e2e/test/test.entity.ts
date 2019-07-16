import { CrudEntity } from '../../src';
import { Column, Entity } from 'typeorm';

@Entity()
export class Test extends CrudEntity {
  @Column({ unique: true })
  testAttribute: string;
}
