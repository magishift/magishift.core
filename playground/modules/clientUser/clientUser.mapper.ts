import { Injectable } from '@nestjs/common';
import { IUser, IUserDto } from '../../../src/user/interfaces/user.interface';
import { UserMapper } from '../../../src/user/user.mapper';
import { ClientUserDto } from './clientUser.dto';
import { ClientUser } from './clientUser.entity';

@Injectable()
export class ClientUserMapper extends UserMapper<IUser, IUserDto> {
  constructor() {
    super(ClientUser, ClientUserDto);
  }
}
