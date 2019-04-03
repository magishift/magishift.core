import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { TENANT_ENDPOINT } from './interfaces/tenant.const';
import { ITenant, ITenantDto } from './interfaces/tenant.interface';
import { TenantMapper } from './tenant.mapper';
import { TenantService } from './tenant.service';

@Controller(TENANT_ENDPOINT)
export class TenantController extends CrudControllerFactory<ITenantDto, ITenant>(TENANT_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(protected readonly service: TenantService, protected readonly mapper: TenantMapper) {
    super(service, mapper);
  }
}
