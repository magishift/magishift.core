import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeycloakAdminService } from '../../../auth/keycloak/keycloakAdmin.service';
import { DraftService } from '../../../crud/draft/draft.service';
import { IUserRole, IUserRoleDto } from '../../../user/userRole/interfaces/userRole.interface';
import { UserRoleService } from '../../../user/userRole/userRole.service';
import { BO_USER_REALM } from '../interfaces/backOfficeUser.const';
import { BackOfficeRole } from './backOfficeRole.entity';
import { BackOfficeRoleMapper } from './backOfficeRole.mapper';

@Injectable()
export class BackOfficeRoleService extends UserRoleService<IUserRole, IUserRoleDto> {
  constructor(
    @InjectRepository(BackOfficeRole) protected readonly repository: Repository<BackOfficeRole>,
    protected readonly draftService: DraftService,
    protected readonly keycloakAdminService: KeycloakAdminService,
    protected readonly mapper: BackOfficeRoleMapper,
  ) {
    super(repository, draftService, mapper, keycloakAdminService, BO_USER_REALM);
  }
}
