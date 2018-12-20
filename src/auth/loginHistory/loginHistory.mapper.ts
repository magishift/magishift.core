import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../crud/crud.mapper';
import { ILoginHistory, ILoginHistoryDto } from './interfaces/loginHistory.interface';
import { LoginHistoryDto } from './loginHistory.dto';
import { LoginHistory } from './loginHistory.entity';

@Injectable()
export class LoginHistoryMapper extends CrudMapper<ILoginHistory, ILoginHistoryDto> {
  constructor() {
    super(LoginHistory, LoginHistoryDto);
  }
}
