import { DataStatus, IBaseDto, IBaseEntity } from '@magishift/base';
import { ApiModelProperty } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { Repository } from 'typeorm';
import { IForm, IFormField, IFormSchema } from './form.interface';
import { IGrid, IGridColumns, IGridSchema } from './grid.interface';

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
  gridSchema: IGrid;
  gridColumns: IGridColumns;
  formSchema: IForm;
  formFields: IFormField[];

  id: string;
  isDeleted: boolean;
  __meta: IDataMeta;

  validate(): Promise<ValidationError[]>;
}

export abstract class ICrudConfig {
  @ApiModelProperty()
  kanban: object;

  @ApiModelProperty()
  form: IFormSchema;

  @ApiModelProperty()
  grid: IGridSchema;

  @ApiModelProperty()
  softDelete: boolean;
}
