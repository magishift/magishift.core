import { ApiModelProperty } from '@nestjs/swagger';

export enum DataHistoryAction {
  Updated = 'updated',
  Created = 'created',
  Deleted = 'deleted',
}

export class DataHistory {
  @ApiModelProperty({ type: String, format: 'date-time' })
  date: Date;

  @ApiModelProperty({ enum: Object.keys(DataHistoryAction).map(key => DataHistoryAction[key]) })
  action: DataHistoryAction;

  @ApiModelProperty()
  by: string;
}

export class DataMeta {
  @ApiModelProperty()
  editable?: boolean;

  @ApiModelProperty()
  deleteable?: boolean;

  @ApiModelProperty()
  dataOwner?: string;

  @ApiModelProperty({ type: DataHistory, isArray: true })
  histories?: DataHistory[];
}
