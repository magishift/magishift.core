import { ICrudDto, ICrudEntity } from '../../../../src/crud/interfaces/crud.interface';
import { IFileStorage, IFileStorageDto } from '../../../../src/fileStorage/interfaces/fileStorage.interface';
import { IClientUser, IClientUserDto } from '../../clientUser/interfaces/clientUser.interface';

export interface ITenant extends ICrudEntity {
  logo: IFileStorage;
  status: string;
  name: string;
  domain: string;
  clientUsers: IClientUser[];
}

export interface ITenantDto extends ICrudDto {
  logo: IFileStorageDto;
  status: string;
  name: string;
  domain: string;
  adminAccounts: IClientUserDto[];
}
