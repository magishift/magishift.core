import { Injectable } from '@nestjs/common';
import { IUser, IUserDto } from '../../user/interfaces/user.interface';
import { UserMapper } from '../../user/user.mapper';
import { AdminDto } from './admin.dto';
import { Admin } from './admin.entity';

@Injectable()
export class AdminMapper extends UserMapper<IUser, IUserDto> {
  constructor() {
    super(Admin, AdminDto);
  }
}
