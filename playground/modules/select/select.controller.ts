import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/role.const';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { SELECT_ENDPOINT } from './interfaces/select.const';
import { ISelect, ISelectDto } from './interfaces/select.interface';
import { SelectMapper } from './select.mapper';
import { SelectService } from './select.service';

@Controller(SELECT_ENDPOINT)
export class SelectController extends CrudControllerFactory<ISelectDto, ISelect>(SELECT_ENDPOINT, {
  default: [DefaultRoles.superAdmin],
}) {
  constructor(readonly selectService: SelectService, protected readonly mapper: SelectMapper) {
    super(selectService, mapper);
  }
}
