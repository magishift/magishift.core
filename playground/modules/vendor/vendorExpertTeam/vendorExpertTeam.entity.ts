import { Column, Entity, ManyToOne } from 'typeorm';
import { CrudEntity } from '../../../../src/crud/crud.entity';
import { FileStorage } from '../../../../src/fileStorage/fileStorage.entity';
import { Vendor } from '../vendor.entity';
import { IVendorExpertTeam } from './interfaces/vendorExpertTeam.interface';

@Entity()
export class VendorExpertTeam extends CrudEntity implements IVendorExpertTeam {
  @Column()
  name: string;

  @ManyToOne(_ => FileStorage, fileStorage => fileStorage.ownerId, { onDelete: 'RESTRICT' })
  cv: FileStorage;

  @Column()
  expertise: string;

  @ManyToOne(_ => Vendor, vendor => vendor.vendorExpertTeam)
  vendor: Vendor;
}
