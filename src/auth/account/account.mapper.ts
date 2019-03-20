import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../crud/crud.mapper';
import { AccountDto } from './account.dto';
import { Account } from './account.entity';
import { IAccount, IAccountDto } from './interfaces/account.interface';

@Injectable()
export class AccountMapper extends CrudMapper<IAccount, IAccountDto> {
  constructor() {
    super(Account, AccountDto);
  }
}
