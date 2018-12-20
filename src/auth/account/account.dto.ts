import { HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { BaseDto } from '../../base/base.dto';
import { IUserDto } from '../../user/interfaces/user.interface';
import { ILoginHistoryDto } from '../loginHistory/interfaces/loginHistory.interface';
import { IAccountDto } from './interfaces/account.interface';

export class AccountDto extends BaseDto implements IAccountDto {
  user?: IUserDto;

  username: string;

  password: string;

  passwordConfirm: string;

  realm: string;

  roles: string[];

  loginHistories: ILoginHistoryDto[];

  isActive: boolean = false;

  createdBy: IAccountDto;

  updatedBy: IAccountDto;

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
