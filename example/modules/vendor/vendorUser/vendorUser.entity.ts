import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { User } from '../../../../src/user/user.entity';
import { Vendor } from '../vendor.entity';
import { IVendorUser } from './interfaces/vendorUser.interface';
import { VendorUserRole } from './vendorUserRole/vendorUserRole.entity';

@Entity()
export class VendorUser extends User implements IVendorUser {
  @Column({ default: true })
  canLogin: boolean;

  @ManyToOne(_ => Vendor, vendor => vendor.vendorUsers)
  vendor: Vendor;

  @ManyToMany(_ => VendorUserRole, vendorUserRole => vendorUserRole.users)
  @JoinTable()
  realmRoles: VendorUserRole[];
}
