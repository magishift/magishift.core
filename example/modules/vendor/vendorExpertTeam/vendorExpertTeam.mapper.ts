import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../../../src/crud/crud.mapper';
import { IVendorExpertTeam, IVendorExpertTeamDto } from './interfaces/vendorExpertTeam.interface';
import { VendorExpertTeamDto } from './vendorExpertTeam.dto';
import { VendorExpertTeam } from './vendorExpertTeam.entity';

@Injectable()
export class VendorExpertTeamMapper extends CrudMapper<IVendorExpertTeam, IVendorExpertTeamDto> {
  constructor() {
    super(VendorExpertTeam, VendorExpertTeamDto);
  }
}
