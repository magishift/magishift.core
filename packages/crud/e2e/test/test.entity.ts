import { CrudEntity } from '../../src';
import { Column, Entity } from 'typeorm';
import { ITest } from './interfaces/test.interface';

@Entity()
export class Test extends CrudEntity implements ITest {
  @Column({ unique: true })
  testAttribute: string;
}
