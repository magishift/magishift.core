import { Injectable } from '@nestjs/common';
import { UserMapper } from '../../../src/user/user.mapper';
import { TenantDto } from '../tenant/tenant.dto';
import { ClientUserDto } from './clientUser.dto';
import { ClientUser } from './clientUser.entity';
import { IClientUser, IClientUserDto } from './interfaces/clientUser.interface';

@Injectable()
export class ClientUserMapper extends UserMapper<IClientUser, IClientUserDto> {
  constructor() {
    super(ClientUser, ClientUserDto);
  }

  async dtoFromObject(obj: IClientUserDto): Promise<IClientUserDto> {
    const result = await super.dtoFromObject(obj);

    if (result.tenantId && !result.tenant) {
      result.tenant = new TenantDto();
      result.tenant.id = result.tenantId;
    }

    return result;
  }
}
