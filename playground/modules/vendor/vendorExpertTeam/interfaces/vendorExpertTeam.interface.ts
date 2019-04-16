import { ICrudDto, ICrudEntity } from '../../../../../src/crud/interfaces/crud.interface';
import { IFileStorage, IFileStorageDto } from '../../../../../src/fileStorage/interfaces/fileStorage.interface';
import { IVendor, IVendorDto } from '../../interfaces/vendor.interface';

export interface IVendorExpertTeam extends ICrudEntity {
  name: string;
  cv: IFileStorage;
  expertise: string;
  vendor: IVendor;
}

export interface IVendorExpertTeamDto extends ICrudDto {
  name: string;
  cv: IFileStorageDto;
  expertise: string;
  vendor: IVendorDto;
}
