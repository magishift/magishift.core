import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeycloakService } from '../../../../../src/auth/keycloak/keycloak.service';
import { DraftService } from '../../../../../src/crud/draft/draft.service';
import { IUserRole, IUserRoleDto } from '../../../../../src/user/userRole/interfaces/userRole.interface';
import { UserRoleService } from '../../../../../src/user/userRole/userRole.service';
import { VENDOR_USER_REALM } from '../interfaces/vendorUser.const';
import { VendorUserRole } from './vendorUserRole.entity';
import { VendorUserRoleMapper } from './vendorUserRole.mapper';

@Injectable()
export class VendorUserRoleService extends UserRoleService<IUserRole, IUserRoleDto> {
  constructor(
    @InjectRepository(VendorUserRole) protected readonly repository: Repository<VendorUserRole>,
    protected readonly draftService: DraftService,
    protected readonly keycloakAdminService: KeycloakService,
    protected readonly mapper: VendorUserRoleMapper,
  ) {
    super(repository, draftService, mapper, keycloakAdminService, VENDOR_USER_REALM);
  }
}
