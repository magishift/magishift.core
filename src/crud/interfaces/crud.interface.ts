import { ValidationError } from 'class-validator';
import { Repository } from 'typeorm';
import { IAccount, IAccountDto } from '../../auth/account/interfaces/account.interface';
import { DataStatus, IBaseDto, IBaseEntity } from '../../base/interfaces/base.interface';

export interface ICrudEntity extends IBaseEntity {
  getRepository: () => Repository<any>;

  createdAt?: Date;

  updatedAt?: Date;

  isDeleted: boolean;

  _dataStatus: DataStatus;

  readonly _dataOwner: IAccount;

  readonly createdBy: IAccount;

  readonly updatedBy: IAccount;
}

export interface ICrudDto extends IBaseDto {
  createdAt?: Date;

  updatedAt?: Date;

  isDeleted?: boolean;

  _dataStatus?: DataStatus;

  _dataOwner?: IAccountDto;

  createdBy?: IAccountDto;

  updatedBy?: IAccountDto;

  validate(): Promise<ValidationError[]>;
}
