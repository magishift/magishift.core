import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { SELECT_ENDPOINT } from './interfaces/select.const';
import { ISelect, ISelectDto } from './interfaces/select.interface';
import { SelectDto } from './select.dto';
import { SelectMapper } from './select.mapper';
import { SelectService } from './select.service';

@Controller(SELECT_ENDPOINT)
export class SelectController extends CrudControllerFactory<ISelectDto, ISelect>(SELECT_ENDPOINT, SelectDto, {
  default: [DefaultRoles.admin],
}) {
  constructor(readonly selectService: SelectService, protected readonly mapper: SelectMapper) {
    super(selectService, mapper);
  }
}
