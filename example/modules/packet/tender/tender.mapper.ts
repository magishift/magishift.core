import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../../../src/crud/crud.mapper';
import { ITender, ITenderDto } from './interfaces/tender.interface';
import { TenderDto } from './tender.dto';
import { Tender } from './tender.entity';

@Injectable()
export class TenderMapper extends CrudMapper<ITender, ITenderDto> {
  constructor() {
    super(Tender, TenderDto);
  }
}
