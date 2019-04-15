import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CrudEntity } from '../../../src/crud/crud.entity';
import { FileStorage } from '../../../src/fileStorage/fileStorage.entity';
import { IUser } from '../../../src/user/interfaces/user.interface';
import { Participant } from '../packet/tender/participant/participant.entity';
import { Tender } from '../packet/tender/tender.entity';
import { IVendor, VendorCategory, VendorStatus, VendorType } from './interfaces/vendor.interface';
import { VendorUser } from './vendorUser/vendorUser.entity';

@Entity()
export class Vendor extends CrudEntity implements IVendor {
  @OneToMany(_ => VendorUser, vendorUser => vendorUser.vendor)
  vendorUsers: IUser[];

  @Column()
  companyName: string;

  @ManyToOne(_ => FileStorage, fileStorage => fileStorage.ownerId, { onDelete: 'RESTRICT' })
  npwp: FileStorage;

  @Column()
  legalType: VendorType;

  @Column()
  officeAddress: string;

  @Column()
  country: string;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  village: string;

  @Column()
  postalCode: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  faxNumber: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  cpName: string;

  @Column({ nullable: true })
  cpPhoneNumber: string;

  @Column({ nullable: true })
  cpEmail: string;

  @Column()
  status: VendorStatus;

  @Column({ nullable: true })
  category: VendorCategory;

  @OneToMany(_ => Participant, participant => participant.participant)
  participates: Participant[];

  @OneToMany(_ => Tender, tender => tender.winner)
  winning: Tender[];
}
