import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { CrudDto } from '../../crud/crud.dto';
import { Form, FormField } from '../../crud/form.decorator';
import { Grid, GridColumn } from '../../crud/grid.decorator';
import { FieldTypes } from '../../crud/interfaces/form.interface';
import { IUserDto } from '../../user/interfaces/user.interface';
import { INotificationDto } from './interfaces/notification.interface';

@Grid()
@Form()
export class NotificationDto extends CrudDto implements INotificationDto {
  @IsUUID()
  @ApiModelProperty()
  @FormField({
    label: 'From',
    type: FieldTypes.Text,
    required: true,
  })
  @GridColumn({ text: 'From', searchAble: true })
  from: IUserDto;

  @IsUUID()
  @ApiModelProperty()
  @FormField({
    label: 'To',
    type: FieldTypes.Text,
    required: true,
  })
  @GridColumn({ text: 'To', searchAble: true })
  to: IUserDto;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Title',
    type: FieldTypes.Text,
    required: true,
  })
  @GridColumn({ text: 'Title', searchAble: true })
  title: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Message',
    type: FieldTypes.Text,
    required: true,
  })
  @GridColumn({ text: 'Message', searchAble: true })
  message: string;
}
