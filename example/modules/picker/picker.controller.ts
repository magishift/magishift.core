import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { PICKER_ENDPOINT } from './interfaces/picker.const';
import { IPicker, IPickerDto } from './interfaces/picker.interface';
import { PickerDto } from './picker.dto';
import { PickerMapper } from './picker.mapper';
import { PickerService } from './picker.service';

@Controller(PICKER_ENDPOINT)
export class PickerController extends CrudControllerFactory<IPickerDto, IPicker>(PICKER_ENDPOINT, PickerDto, {
  default: [DefaultRoles.admin],
}) {
  constructor(readonly pickerService: PickerService, protected readonly mapper: PickerMapper) {
    super(pickerService, mapper);
  }
}
