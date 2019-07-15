import { DataStatus, IBaseDto, IBaseEntity } from '@magishift/base';
import { ApiModelProperty } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { Repository } from 'typeorm';

export enum DataHistoryAction {
  Updated = 'updated',
  Created = 'created',
  Deleted = 'deleted',
}

export abstract class IDataHistory {
  @ApiModelProperty()
  date: Date;

  @ApiModelProperty({ enum: Object.keys(DataHistoryAction).map(key => DataHistoryAction[key]) })
  action: DataHistoryAction;

  @ApiModelProperty()
  by: string;
}

export abstract class IDataMeta {
  @ApiModelProperty({ required: false, enum: Object.keys(DataStatus).map(key => DataStatus[key]) })
  dataStatus?: DataStatus;

  @ApiModelProperty({ required: false })
  editable?: boolean;

  @ApiModelProperty({ required: false })
  deleteable?: boolean;

  @ApiModelProperty({ required: false })
  dataOwner?: string;

  @ApiModelProperty({ required: false })
  histories?: IDataHistory[];
}

export abstract class ICrudEntity implements IBaseEntity {
  id: string;

  isDeleted?: boolean;

  __meta?: IDataMeta;

  getRepository: () => Repository<any>;
}

export abstract class ICrudDto implements IBaseDto {
  @ApiModelProperty({ readOnly: true })
  id: string;

  @ApiModelProperty({ required: false })
  isDeleted?: boolean;

  @ApiModelProperty({ required: false, readOnly: true })
  __meta?: IDataMeta;

  abstract validate(): Promise<ValidationError[]>;
}
