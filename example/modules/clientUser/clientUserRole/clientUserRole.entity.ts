import { Entity, ManyToMany } from 'typeorm';
import { IUserRole } from '../../../../src/user/userRole/interfaces/userRole.interface';
import { UserRole } from '../../../../src/user/userRole/userRole.entity';
import { ClientUser } from '../clientUser.entity';

@Entity()
export class ClientUserRole extends UserRole implements IUserRole {
  @ManyToMany(_ => ClientUser, clientUser => clientUser.realmRoles)
  users: ClientUser[];
}
