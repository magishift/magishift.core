import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../crud/crud.mapper';
import { IRole, IRoleDto } from './interfaces/role.interface';
import { RoleDto } from './role.dto';
import { Role } from './role.entity';

@Injectable()
export class RoleMapper extends CrudMapper<IRole, IRoleDto> {
  constructor() {
    super(Role, RoleDto);
  }
}
