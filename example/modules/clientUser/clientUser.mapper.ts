import { Injectable } from '@nestjs/common';
import { UserMapper } from '../../../src/user/user.mapper';
import { ClientUserDto } from './clientUser.dto';
import { ClientUser } from './clientUser.entity';
import { IClientUser, IClientUserDto } from './interfaces/clientUser.interface';

@Injectable()
export class ClientUserMapper extends UserMapper<IClientUser, IClientUserDto> {
  constructor() {
    super(ClientUser, ClientUserDto);
  }
}
