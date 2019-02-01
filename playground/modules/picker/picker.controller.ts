import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/role.const';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { PICKER_ENDPOINT } from './interfaces/picker.const';
import { IPicker, IPickerDto } from './interfaces/picker.interface';
import { PickerMapper } from './picker.mapper';
import { PickerService } from './picker.service';

@Controller(PICKER_ENDPOINT)
export class PickerController extends CrudControllerFactory<IPickerDto, IPicker>(PICKER_ENDPOINT, {
  default: [DefaultRoles.superAdmin],
}) {
  constructor(readonly pickerService: PickerService, protected readonly mapper: PickerMapper) {
    super(pickerService, mapper);
  }
}
