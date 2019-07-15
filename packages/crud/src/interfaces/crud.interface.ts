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
  @ApiModelProperty()
  editable?: boolean;

  @ApiModelProperty()
  deleteable?: boolean;

  @ApiModelProperty()
  dataOwner?: string;

  @ApiModelProperty({ type: IDataHistory, isArray: true })
  histories?: IDataHistory[];
}

export interface ICrudEntity {
  id: string;

  publicId: string;

  isDeleted?: boolean;

  __meta?: IDataMeta;

  getRepository: () => Repository<any>;
}

export interface ICrudDto {
  id?: string;

  publicId?: string;

  isDeleted?: boolean;

  __meta?: IDataMeta;
}
