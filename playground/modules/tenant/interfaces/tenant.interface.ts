import { ICrudDto, ICrudEntity } from '../../../../src/crud/interfaces/crud.interface';
import { IClientUser, IClientUserDto } from '../../clientUser/interfaces/clientUser.interface';

export interface ITenant extends ICrudEntity {
  status: string;
  name: string;
  domain: string;
  clientUsers: IClientUser[];
}

export interface ITenantDto extends ICrudDto {
  status: string;
  name: string;
  domain: string;
  adminAccounts: IClientUserDto[];
}
