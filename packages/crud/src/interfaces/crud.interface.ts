import { ApiModelProperty } from '@nestjs/swagger';
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
  @ApiModelProperty({ required: false })
  editable?: boolean;

  @ApiModelProperty({ required: false })
  deleteable?: boolean;

  @ApiModelProperty({ required: false })
  dataOwner?: string;

  @ApiModelProperty({ required: false })
  histories?: IDataHistory[];
}

export interface ICrudEntity {
  id: string;

  isDeleted?: boolean;

  __meta?: IDataMeta;

  getRepository: () => Repository<any>;
}

export abstract class ICrudDto {
  @ApiModelProperty({ readOnly: true })
  id?: string;

  @ApiModelProperty({ required: false })
  isDeleted?: boolean;

  @ApiModelProperty({ required: false, readOnly: true })
  __meta?: IDataMeta;
}
