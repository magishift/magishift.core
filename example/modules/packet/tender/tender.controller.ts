import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../../src/crud/crud.controller';
import { TENDER_ENDPOINT } from './interfaces/tender.const';
import { ITender, ITenderDto } from './interfaces/tender.interface';
import { TenderDto } from './tender.dto';
import { TenderMapper } from './tender.mapper';
import { TenderService } from './tender.service';

@Controller(TENDER_ENDPOINT)
export class TenderController extends CrudControllerFactory<ITenderDto, ITender>(TENDER_ENDPOINT, TenderDto, {
  default: [DefaultRoles.admin],
}) {
  constructor(protected readonly service: TenderService, protected readonly mapper: TenderMapper) {
    super(service, mapper);
  }
}
