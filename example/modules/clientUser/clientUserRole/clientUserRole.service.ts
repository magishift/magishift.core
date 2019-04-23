import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeycloakService } from '../../../../src/auth/keycloak/keycloak.service';
import { DraftService } from '../../../../src/crud/draft/draft.service';
import { IUserRole, IUserRoleDto } from '../../../../src/user/userRole/interfaces/userRole.interface';
import { UserRoleService } from '../../../../src/user/userRole/userRole.service';
import { CLIENT_USER_REALM } from '../interfaces/clientUser.const';
import { ClientUserRole } from './clientUserRole.entity';
import { ClientUserRoleMapper } from './clientUserRole.mapper';

@Injectable()
export class ClientUserRoleService extends UserRoleService<IUserRole, IUserRoleDto> {
  constructor(
    @InjectRepository(ClientUserRole) protected readonly repository: Repository<ClientUserRole>,
    protected readonly draftService: DraftService,
    protected readonly keycloakAdminService: KeycloakService,
    protected readonly mapper: ClientUserRoleMapper,
  ) {
    super(repository, draftService, mapper, keycloakAdminService, CLIENT_USER_REALM);
  }
}
