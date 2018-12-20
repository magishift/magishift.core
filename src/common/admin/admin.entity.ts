import { Column, Entity } from 'typeorm';
import { User } from '../../user/user.entity';
import { ADMIN_REALM } from './interfaces/admin.const';
import { IAdmin } from './interfaces/admin.interface';

@Entity()
export class Admin extends User implements IAdmin {
  @Column({ default: 'admin' })
  role: 'admin' = ADMIN_REALM;
}
