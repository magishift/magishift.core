import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../../src/crud/crud.mapper';
import { IPicker, IPickerDto } from './interfaces/picker.interface';
import { PickerDto } from './picker.dto';
import { Picker } from './picker.entity';

@Injectable()
export class PickerMapper extends CrudMapper<IPicker, IPickerDto> {
  constructor() {
    super(Picker, PickerDto);
  }
}
