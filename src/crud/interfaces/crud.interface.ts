import { ValidationError } from 'class-validator';
import { Repository } from 'typeorm';
import { DataStatus, IBaseDto, IBaseEntity } from '../../base/interfaces/base.interface';
import { IForm, IFormField, IFormSchema } from './form.interface';
import { IGrid, IGridColumns, IGridSchema } from './grid.interface';

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
  id: string;
  isDeleted?: boolean;
  __meta: IDataMeta;

  getRepository: () => Repository<any>;
}

export interface ICrudDto extends IBaseDto {
  gridSchema: IGrid;
  gridColumns: IGridColumns;
  formSchema: IForm;
  formFields: IFormField[];

  id: string;
  isDeleted: boolean;
  __meta: IDataMeta;

  validate(): Promise<ValidationError[]>;
}

export interface ICrudConfig {
  kanban: object;
  form: IFormSchema;
  grid: IGridSchema;
  softDelete: boolean;
  enableDraft: boolean;
}
