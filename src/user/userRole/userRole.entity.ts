import { Column } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { IUserRole } from './interfaces/userRole.interface';

export abstract class UserRole extends CrudEntity implements IUserRole {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  constructor(init?: Partial<UserRole>) {
    super();
    Object.assign(this, init);
  }
}
