import { Injectable } from '@nestjs/common';
import { AccountMapper } from '../../auth/account/account.mapper';
import { UserMapper } from '../../user/user.mapper';
import { AdminDto } from './admin.dto';
import { Admin } from './admin.entity';
import { IAdmin, IAdminDto } from './interfaces/admin.interface';

@Injectable()
export class AdminMapper extends UserMapper<IAdmin, IAdminDto> {
  constructor(protected readonly accountMapper: AccountMapper) {
    super(accountMapper, Admin, AdminDto);
  }
}
