import { Injectable } from '@nestjs/common';
import { UserMapper } from '../../../../src/user/user.mapper';
import { IVendorUser, IVendorUserDto } from './interfaces/vendorUser.interface';
import { VendorUserDto } from './vendorUser.dto';
import { VendorUser } from './vendorUser.entity';

@Injectable()
export class VendorUserMapper extends UserMapper<IVendorUser, IVendorUserDto> {
  constructor() {
    super(VendorUser, VendorUserDto);
  }
}
