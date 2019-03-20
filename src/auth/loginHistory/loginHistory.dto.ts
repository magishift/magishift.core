import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { CrudDto } from '../../crud/crud.dto';
import { Grid, GridColumn } from '../../crud/grid.decorator';
import { ColumnTypes } from './../../crud/interfaces/grid.interface';
import { ILoginHistoryDto } from './interfaces/loginHistory.interface';

@Grid({
  options: {
    view: false,
    delete: false,
    create: false,
    update: false,
  },
  foreignKey: {
    account: 'accountId',
  },
})
export class LoginHistoryDto extends CrudDto implements ILoginHistoryDto {
  @GridColumn({ text: 'Id' })
  id: string;

  @GridColumn({ text: 'Account Id' })
  accountId: string;

  @IsDate()
  @ApiModelProperty()
  @GridColumn({ text: 'Login Time', type: ColumnTypes.Date })
  loginTime: Date;

  @GridColumn({ text: 'Session Id' })
  sessionId: string;

  @GridColumn({ text: 'Actions' })
  actions: string[];

  constructor(init?: Partial<LoginHistoryDto>) {
    super();
    Object.assign(this, init);
  }
}
