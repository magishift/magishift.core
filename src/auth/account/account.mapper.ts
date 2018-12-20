import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../crud/crud.mapper';
import { Entity2Dto } from '../../utils/objectMapper.utils';
import { AccountDto } from './account.dto';
import { Account } from './account.entity';
import { IAccount, IAccountDto } from './interfaces/account.interface';

@Injectable()
export class AccountMapper extends CrudMapper<IAccount, IAccountDto> {
  constructor() {
    super(Account, AccountDto);
  }

  async entityToDto(entity: IAccount): Promise<IAccountDto> {
    const dto = Entity2Dto(entity, this.getNewDto);

    dto.password = undefined;

    return dto;
  }
}
