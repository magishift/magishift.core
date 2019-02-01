import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../crud/crud.service';
import { DraftService } from '../../crud/draft/draft.service';
import { IRole, IRoleDto } from './interfaces/role.interface';
import { Role } from './role.entity';
import { RoleMapper } from './role.mapper';

@Injectable()
export class RoleService extends CrudService<IRole, IRoleDto> {
  constructor(
    @InjectRepository(Role) protected readonly repository: Repository<Role>,
    protected readonly draftService: DraftService,
    protected readonly mapper: RoleMapper,
  ) {
    super(repository, draftService, mapper, false);
  }
}
