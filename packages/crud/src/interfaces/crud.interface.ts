import { DataStatus, IBaseDto, IBaseEntity } from '@magishift/base';
import { ValidationError } from 'class-validator';
import { Repository } from 'typeorm';

export interface IDataHistory {
  date: Date;
  action: 'updated' | 'created' | 'deleted';
  by: string;
}

export interface IDataMeta {
  dataStatus?: DataStatus;
  editable?: boolean;
  deleteable?: boolean;
  dataOwner?: string;
  histories?: IDataHistory[];
}

export interface ICrudEntity extends IBaseEntity {
  id: string;
  isDeleted?: boolean;
  __meta: IDataMeta;

  getRepository: () => Repository<any>;
}

export interface ICrudDto extends IBaseDto {
  id: string;

  isDeleted: boolean;

  __meta: IDataMeta;

  validate(): Promise<ValidationError[]>;
}
