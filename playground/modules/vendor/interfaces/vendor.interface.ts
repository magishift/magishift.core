import { ICrudDto, ICrudEntity } from '../../../../src/crud/interfaces/crud.interface';
import { IUser, IUserDto } from '../../../../src/user/interfaces/user.interface';
import { ITender, ITenderDto } from '../../packet/tender/interfaces/tender.interface';
import { IParticipant, IParticipantDto } from '../../packet/tender/participant/interfaces/participant.interface';
import { IFileStorage, IFileStorageDto } from '../../../../src/fileStorage/interfaces/fileStorage.interface';

export enum VendorType {
  BUMD = 'BUMD',
  BUMN = 'BUMN',
  CV = 'CV',
  Firma = 'Firma',
  Koperasi = 'Koperasi',
  Lembaga = 'Lembaga',
  Notaris = 'Notaris',
  NV = 'NV',
  Perjan = 'Perjan',
  Perum = 'Perum',
  PO = 'PO',
  PT = 'PT',
  PD = 'PD',
  Persero = 'Persero',
  UD = 'UD',
  Yayasan = 'Yayasan',
  KoperasiBersama = 'Koperasi Bersama',
}

export enum VendorStatus {
  NonActive = 'Non-active',
  Active = 'Active',
  Terverifikasi = 'Terverifikasi',
  Blacklist = 'Blacklist',
}

export enum VendorCategory {
  IT = 'IT',
  Accounting = 'Accounting',
  ManagementConsultant = 'Management Consultant',
  Architecture = 'Architecture',
}

export interface IVendor extends ICrudEntity {
  vendorUsers: IUser[];
  companyName: string;
  npwp: IFileStorage;
  legalType: VendorType;
  category: VendorCategory;
  officeAddress: string;
  country: string;
  province: string;
  city: string;
  district: string;
  village: string;
  postalCode: string;
  phoneNumber: string;
  faxNumber: string;
  email: string;
  website: string;
  cpName: string;
  cpPhoneNumber: string;
  cpEmail: string;
  status: VendorStatus;
  participates: IParticipant[];
  winning: ITender[];
}

export interface IVendorDto extends ICrudDto {
  vendorUsers: IUserDto[];
  companyName: string;
  npwp: IFileStorageDto;
  legalType: VendorType;
  category: VendorCategory;
  officeAddress: string;
  country: string;
  province: string;
  city: string;
  district: string;
  village: string;
  postalCode: string;
  phoneNumber: string;
  faxNumber: string;
  email: string;
  website: string;
  cpName: string;
  cpPhoneNumber: string;
  cpEmail: string;
  status: VendorStatus;
  participates: IParticipantDto[];
  winning: ITenderDto[];
}
