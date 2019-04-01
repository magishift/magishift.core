import { Injectable } from '@nestjs/common';
import { IUser, IUserDto } from '../../user/interfaces/user.interface';
import { UserMapper } from '../../user/user.mapper';
import { BackOfficeUserDto } from './backOfficeUser.dto';
import { BackOfficeUser } from './backOfficeUser.entity';

@Injectable()
export class BackOfficeUserMapper extends UserMapper<IUser, IUserDto> {
  constructor() {
    super(BackOfficeUser, BackOfficeUserDto);
  }
}
