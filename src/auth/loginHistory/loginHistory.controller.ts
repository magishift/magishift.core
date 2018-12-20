import { Controller } from '@nestjs/common';
import { CrudControllerFactory } from '../../crud/crud.controller';
import { DefaultRoles } from '../role/role.const';
import { LOGIN_HISTORY_ENDPOINT } from './interfaces/loginHistory.const';
import { ILoginHistory, ILoginHistoryDto } from './interfaces/loginHistory.interface';
import { LoginHistoryMapper } from './loginHistory.mapper';
import { LoginHistoryService } from './loginHistory.service';

@Controller(LOGIN_HISTORY_ENDPOINT)
export class LoginHistoryController extends CrudControllerFactory<ILoginHistoryDto, ILoginHistory>(
  LOGIN_HISTORY_ENDPOINT,
  {
    default: [DefaultRoles.authenticated],
  },
) {
  constructor(protected readonly service: LoginHistoryService, protected readonly mapper: LoginHistoryMapper) {
    super(service, mapper);
  }
}
