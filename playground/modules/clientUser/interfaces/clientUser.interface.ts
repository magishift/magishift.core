import { IUser, IUserDto } from '../../../../src/user/interfaces/user.interface';
import { ITenant, ITenantDto } from '../../tenant/interfaces/tenant.interface';

export interface IClientUser extends IUser {
  tenant: ITenant;
}

export interface IClientUserDto extends IUserDto {
  tenant: ITenantDto;
  tenantId: string;
}
