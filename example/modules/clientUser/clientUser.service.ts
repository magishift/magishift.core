import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../../../src/auth/auth.service';
import { KeycloakService } from '../../../src/auth/keycloak/keycloak.service';
import { DraftService } from '../../../src/crud/draft/draft.service';
import { UserService } from '../../../src/user/user.service';
import { ClientUser } from './clientUser.entity';
import { ClientUserMapper } from './clientUser.mapper';
import { ClientUserRoleService } from './clientUserRole/clientUserRole.service';
import { CLIENT_USER_REALM } from './interfaces/clientUser.const';
import { IClientUser, IClientUserDto } from './interfaces/clientUser.interface';

@Injectable()
export class ClientUserService extends UserService<IClientUser, IClientUserDto> {
  constructor(
    @InjectRepository(ClientUser) protected readonly repository: Repository<ClientUser>,
    protected readonly authService: AuthService,
    protected readonly clientUserRoleService: ClientUserRoleService,
    protected readonly keycloakAdminService: KeycloakService,
    protected readonly mapper: ClientUserMapper,
    protected readonly draftService: DraftService,
  ) {
    super(
      repository,
      authService,
      keycloakAdminService,
      clientUserRoleService,
      draftService,
      mapper,
      CLIENT_USER_REALM,
    );
  }
}
