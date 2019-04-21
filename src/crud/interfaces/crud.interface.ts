import { ValidationError } from 'class-validator';
import { Field, InterfaceType } from 'type-graphql';
import { Repository } from 'typeorm';
import { DataStatus, IBaseDto, IBaseEntity } from '../../base/interfaces/base.interface';
import { IForm, IFormField, IFormSchema } from './form.interface';
import { IGrid, IGridColumns, IGridSchema } from './grid.interface';

@InterfaceType()
export abstract class IDataHsitory {
  @Field()
  date: Date;

  @Field()
  action: 'updated' | 'created' | 'deleted';

  @Field()
  by: string;
}

@InterfaceType()
export abstract class IDataMeta {
  dataStatus?: DataStatus;

  @Field()
  editable?: boolean;

  @Field()
  deleteable?: boolean;

  @Field()
  dataOwner?: string;

  histories?: IDataHsitory[];
}

export abstract class ICrudEntity implements IBaseEntity {
  id: string;
  isDeleted?: boolean;
  __meta: IDataMeta;
  abstract getRepository: () => Repository<any>;
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

@InterfaceType()
export abstract class ICrudConfig {
  kanban: object;
  form: IFormSchema;
  grid: IGridSchema;

  @Field()
  softDelete: boolean;

  @Field()
  enableDraft: boolean;
}
