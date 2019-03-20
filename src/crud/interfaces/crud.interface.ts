import { ValidationError } from 'class-validator';
import { Repository } from 'typeorm';
import { DataStatus, IBaseDto, IBaseEntity } from '../../base/interfaces/base.interface';

export interface IDataHsitory {
  date: Date;
  action: 'updated' | 'created' | 'deleted';
  by: string;
}

export interface IDataMeta {
  dataStatus?: DataStatus;
  editable?: boolean;
  deleteable?: boolean;
  dataOwner?: string;
  histories?: IDataHsitory[];
}

export interface ICrudEntity extends IBaseEntity {
  getRepository: () => Repository<any>;

  isDeleted: boolean;

  __meta: IDataMeta;
}

export interface ICrudDto extends IBaseDto {
  isDeleted?: boolean;

  __meta?: IDataMeta;

  validate(): Promise<ValidationError[]>;
}
