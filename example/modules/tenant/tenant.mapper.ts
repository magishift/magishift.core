import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../../src/crud/crud.mapper';
import { ITenant, ITenantDto } from './interfaces/tenant.interface';
import { TenantDto } from './tenant.dto';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantMapper extends CrudMapper<ITenant, ITenantDto> {
  constructor() {
    super(Tenant, TenantDto);
  }
}
