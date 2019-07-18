import { MagiEntity } from '../../src';
import { Column, Entity } from 'typeorm';

@Entity()
export class Cat extends MagiEntity {
  @Column({ unique: true })
  catAttribute: string;
}
