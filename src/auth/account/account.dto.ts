import { HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { BaseDto } from '../../base/base.dto';
import { IDataMeta } from '../../crud/interfaces/crud.interface';
import { IAccountDto } from './interfaces/account.interface';

export class AccountDto extends BaseDto implements IAccountDto {
  username: string;

  enabled: boolean = true;

  emailVerified: boolean;

  email: string;

  firstName: string;

  lastName: string;

  realmRoles: string[];

  password?: string;

  passwordConfirm?: string;

  isDeleted?: boolean;

  __meta?: IDataMeta = {};

  constructor(init?: Partial<AccountDto>) {
    super();
    Object.assign(this, init);
  }

  validate(): Promise<ValidationError[]> {
    if (this.passwordConfirm && this.passwordConfirm !== this.password) {
      throw new HttpException(`Confirmation password doesn't match with password`, 400);
    }

    return super.validate();
  }
}
