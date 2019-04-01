import { Entity, JoinTable, ManyToMany } from 'typeorm';
import { IUser } from '../../../src/user/interfaces/user.interface';
import { User } from '../../../src/user/user.entity';
import { ClientUserRole } from './clientUserRole/clientUserRole.entity';

@Entity()
export class ClientUser extends User implements IUser {
  @ManyToMany(_ => ClientUserRole, clientUserRole => clientUserRole.users)
  @JoinTable()
  realmRoles: ClientUserRole[];
}
