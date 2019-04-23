import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../../src/crud/crud.mapper';
import { ISelect, ISelectDto } from './interfaces/select.interface';
import { SelectDto } from './select.dto';
import { Select } from './select.entity';

@Injectable()
export class SelectMapper extends CrudMapper<ISelect, ISelectDto> {
  constructor() {
    super(Select, SelectDto);
  }
}
