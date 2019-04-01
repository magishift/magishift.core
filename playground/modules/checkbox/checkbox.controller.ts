import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { CheckboxMapper } from './checkbox.mapper';
import { CheckboxService } from './checkbox.service';
import { CHECKBOX_ENDPOINT } from './interfaces/checkbox.const';
import { ICheckbox, ICheckboxDto } from './interfaces/checkbox.interface';

@Controller(CHECKBOX_ENDPOINT)
export class CheckboxController extends CrudControllerFactory<ICheckboxDto, ICheckbox>(CHECKBOX_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(readonly checkboxService: CheckboxService, protected readonly mapper: CheckboxMapper) {
    super(checkboxService, mapper);
  }
}
