import { Entity, ManyToMany } from 'typeorm';
import { IUserRole } from '../../../../../src/user/userRole/interfaces/userRole.interface';
import { UserRole } from '../../../../../src/user/userRole/userRole.entity';
import { VendorUser } from '../vendorUser.entity';

@Entity()
export class VendorUserRole extends UserRole implements IUserRole {
  @ManyToMany(_ => VendorUser, vendorUser => vendorUser.realmRoles)
  users: VendorUser[];
}
