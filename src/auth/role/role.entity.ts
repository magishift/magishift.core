import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { ICrudEntity } from '../../crud/interfaces/crud.interface';

@Entity()
export class Role extends CrudEntity implements ICrudEntity {
  @Column({ unique: true })
  title: string;
}
