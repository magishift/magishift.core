import { Entity, JoinTable, ManyToMany } from 'typeorm';
import { IUser } from '../../user/interfaces/user.interface';
import { User } from '../../user/user.entity';
import { BackOfficeRole } from './backOfficeRole/backOfficeRole.entity';

@Entity()
export class BackOfficeUser extends User implements IUser {
  @ManyToMany(() => BackOfficeRole, backOfficeRole => backOfficeRole.users)
  @JoinTable()
  realmRoles: BackOfficeRole[];
}
