import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { IRole } from './interfaces/role.interface';

@Entity()
export class Role extends CrudEntity implements IRole {
  @Column({ unique: true })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  constructor(init?: Partial<Role>) {
    super();
    Object.assign(this, init);
  }
}
