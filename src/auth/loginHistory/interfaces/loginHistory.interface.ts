import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';
import { IAccount, IAccountDto } from '../../account/interfaces/account.interface';

export interface ILoginHistory extends ICrudEntity {
  account: IAccount;
  loginTime: Date;
  actions: string[];
  sessionId: string;
}

export interface ILoginHistoryDto extends ICrudDto {
  account: IAccountDto;
  loginTime: Date;
  actions: string[];
  sessionId: string;
}
