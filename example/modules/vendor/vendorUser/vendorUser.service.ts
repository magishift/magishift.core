import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../../../../src/auth/auth.service';
import { KeycloakService } from '../../../../src/auth/keycloak/keycloak.service';
import { DraftService } from '../../../../src/crud/draft/draft.service';
import { UserService } from '../../../../src/user/user.service';
import { VENDOR_USER_REALM } from './interfaces/vendorUser.const';
import { IVendorUser, IVendorUserDto } from './interfaces/vendorUser.interface';
import { VendorUser } from './vendorUser.entity';
import { VendorUserMapper } from './vendorUser.mapper';
import { VendorUserRoleService } from './vendorUserRole/vendorUserRole.service';

@Injectable()
export class VendorUserService extends UserService<IVendorUser, IVendorUserDto> {
  constructor(
    @InjectRepository(VendorUser) protected readonly repository: Repository<VendorUser>,
    protected readonly authService: AuthService,
    protected readonly vendorUserRoleService: VendorUserRoleService,
    protected readonly keycloakAdminService: KeycloakService,
    protected readonly mapper: VendorUserMapper,
    protected readonly draftService: DraftService,
  ) {
    super(
      repository,
      authService,
      keycloakAdminService,
      vendorUserRoleService,
      draftService,
      mapper,
      VENDOR_USER_REALM,
    );
  }
}
