import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../../src/crud/crud.mapper';
import { CheckboxDto } from './checkbox.dto';
import { Checkbox } from './checkbox.entity';
import { ICheckbox, ICheckboxDto } from './interfaces/checkbox.interface';

@Injectable()
export class CheckboxMapper extends CrudMapper<ICheckbox, ICheckboxDto> {
  constructor() {
    super(Checkbox, CheckboxDto);
  }
}
