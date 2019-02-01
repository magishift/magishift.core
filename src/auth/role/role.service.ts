import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { FindOneOptions, Repository } from 'typeorm';
import { CrudService } from '../../crud/crud.service';
import { DraftService } from '../../crud/draft/draft.service';
import { IFilter } from '../../crud/interfaces/filter.interface';
import { IRole, IRoleDto } from './interfaces/role.interface';
import { DefaultRoles } from './role.const';
import { RoleDto } from './role.dto';
import { Role } from './role.entity';
import { RoleMapper } from './role.mapper';

@Injectable()
export class RoleService extends CrudService<IRole, IRoleDto> {
  private adminRole: IRoleDto = new RoleDto({
    id: '00000000-00000-0000-0000-000000000001',
    title: DefaultRoles.admin,
    description: 'Default role',
    _editable: false,
    _deleteable: false,
  });

  private authenticatedRole: IRoleDto = new RoleDto({
    id: '00000000-00000-0000-0000-000000000002',
    title: DefaultRoles.authenticated,
    description: 'Default role',
    _editable: false,
    _deleteable: false,
  });

  private ownerRole: IRoleDto = new RoleDto({
    id: '00000000-00000-0000-0000-00000000003',
    title: DefaultRoles.owner,
    description: 'Default role',
    _editable: false,
    _deleteable: false,
  });

  private publicRole: IRoleDto = new RoleDto({
    id: '00000000-00000-0000-0000-00000000004',
    title: DefaultRoles.public,
    description: 'Default role',
    _editable: false,
    _deleteable: false,
  });

  private defaultRoles: IRoleDto[] = [this.adminRole, this.authenticatedRole, this.ownerRole, this.publicRole];

  constructor(
    @InjectRepository(Role) protected readonly repository: Repository<Role>,
    protected readonly draftService: DraftService,
    protected readonly mapper: RoleMapper,
  ) {
    super(repository, draftService, mapper, false);
  }

  async fetch(
    id: string,
    options?: FindOneOptions<IRole>,
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<IRoleDto> {
    const findInDefaultRoles = _.find(this.defaultRoles, { id });

    if (findInDefaultRoles) {
      return findInDefaultRoles;
    }

    const result = await super.fetch(id, options, permissions);
    return result;
  }

  async findAll(
    filter: IFilter = {
      offset: 0,
      limit: 10,
      isShowDraft: false,
      isShowDeleted: false,
    },
    permissions?: (DefaultRoles.public | DefaultRoles.authenticated | DefaultRoles.admin | string)[],
  ): Promise<IRoleDto[]> {
    const result = await super.findAll(filter, permissions);

    return [...this.defaultRoles, ...result];
  }
}
