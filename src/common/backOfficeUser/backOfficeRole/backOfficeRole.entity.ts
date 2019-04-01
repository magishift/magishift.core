import { Entity, ManyToMany } from 'typeorm';
import { IUserRole } from '../../../user/userRole/interfaces/userRole.interface';
import { UserRole } from '../../../user/userRole/userRole.entity';
import { BackOfficeUser } from '../backOfficeUser.entity';

@Entity()
export class BackOfficeRole extends UserRole implements IUserRole {
  @ManyToMany(_ => BackOfficeUser, backOfficeUser => backOfficeUser.realmRoles)
  users: BackOfficeUser[];
}
