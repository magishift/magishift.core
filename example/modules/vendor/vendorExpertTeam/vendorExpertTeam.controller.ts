import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../../src/crud/crud.controller';
import { VENDOR_EXPERT_TEAM_ENDPOINT } from './interfaces/vendorExpertTeam.const';
import { IVendorExpertTeam, IVendorExpertTeamDto } from './interfaces/vendorExpertTeam.interface';
import { VendorExpertTeamDto } from './vendorExpertTeam.dto';
import { VendorExpertTeamMapper } from './vendorExpertTeam.mapper';
import { VendorExpertTeamService } from './vendorExpertTeam.service';

@Controller(VENDOR_EXPERT_TEAM_ENDPOINT)
export class VendorExpertTeamController extends CrudControllerFactory<IVendorExpertTeamDto, IVendorExpertTeam>(
  VENDOR_EXPERT_TEAM_ENDPOINT,
  VendorExpertTeamDto,
  {
    default: [DefaultRoles.authenticated],
  },
) {
  constructor(protected readonly service: VendorExpertTeamService, protected readonly mapper: VendorExpertTeamMapper) {
    super(service, mapper);
  }
}
