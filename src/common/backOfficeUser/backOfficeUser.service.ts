import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../../auth/auth.service';
import { KeycloakService } from '../../auth/keycloak/keycloak.service';
import { DraftService } from '../../crud/draft/draft.service';
import { IUser, IUserDto } from '../../user/interfaces/user.interface';
import { UserService } from '../../user/user.service';
import { BackOfficeRoleService } from './backOfficeRole/backOfficeRole.service';
import { BackOfficeUser } from './backOfficeUser.entity';
import { BackOfficeUserMapper } from './backOfficeUser.mapper';
import { BO_USER_REALM } from './interfaces/backOfficeUser.const';

@Injectable()
export class BackOfficeUserService extends UserService<IUser, IUserDto> {
  constructor(
    @InjectRepository(BackOfficeUser) protected readonly repository: Repository<BackOfficeUser>,
    protected readonly authService: AuthService,
    protected readonly backOfficeRoleService: BackOfficeRoleService,
    protected readonly keycloakAdminService: KeycloakService,
    protected readonly mapper: BackOfficeUserMapper,
    protected readonly draftService: DraftService,
  ) {
    super(repository, authService, keycloakAdminService, backOfficeRoleService, draftService, mapper, BO_USER_REALM);
  }
}
