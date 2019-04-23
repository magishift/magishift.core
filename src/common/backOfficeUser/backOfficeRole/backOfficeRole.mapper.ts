import { Injectable } from '@nestjs/common';
import { IUserRole, IUserRoleDto } from '../../../user/userRole/interfaces/userRole.interface';
import { UserRoleMapper } from '../../../user/userRole/userRole.mapper';
import { BackOfficeRoleDto } from './backOfficeRole.dto';
import { BackOfficeRole } from './backOfficeRole.entity';

@Injectable()
export class BackOfficeRoleMapper extends UserRoleMapper<IUserRole, IUserRoleDto> {
  constructor() {
    super(BackOfficeRole, BackOfficeRoleDto);
  }
}
