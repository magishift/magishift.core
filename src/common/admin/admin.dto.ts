import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { ILoginHistoryDto } from '../../auth/loginHistory/interfaces/loginHistory.interface';
import { Form, FormField } from '../../crud/form.decorator';
import { Grid, GridColumn } from '../../crud/grid.decorator';
import { FieldModes, FieldTypes } from '../../crud/interfaces/form.interface';
import { ColumnTypes } from '../../crud/interfaces/grid.interface';
import { IFileStorageDto } from '../../fileStorage/interfaces/fileStorage.interface';
import { UserDto } from '../../user/user.dto';
import { ADMIN_ENDPOINT, ADMIN_REALM } from './interfaces/admin.const';
import { IAdminDto } from './interfaces/admin.interface';

const PASSWORD = 'Password';

@Grid({
  options: {
    custom: {
      icon: 'vpn_key',
      type: 'form',
      formUrl: 'changePasswordForm',
      action: 'changePassword',
    },
  },
})
@Form()
export class AdminDto extends UserDto implements IAdminDto {
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Photo',
    required: true,
    type: FieldTypes.Image,
    uploadUrl: ADMIN_ENDPOINT + '/photo',
  })
  @GridColumn({ text: 'Photo', type: ColumnTypes.Image })
  photo: IFileStorageDto;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Name', required: true })
  @GridColumn({ text: 'Name', searchAble: true })
  name: string;

  @IsEmail()
  @ApiModelProperty()
  @FormField({ label: 'Email', type: FieldTypes.Email, required: true })
  @GridColumn({ text: 'Email' })
  email: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Phone Number' })
  @GridColumn({ text: 'Phone Number' })
  phoneNumber: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Username', required: true })
  username: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Password',
    type: FieldTypes.Password,
    mode: FieldModes.Create,
    required: true,
    group: PASSWORD,
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Confirm Password',
    type: FieldTypes.Password,
    mode: FieldModes.Create,
    required: true,
    group: PASSWORD,
  })
  passwordConfirm: string;

  @IsBoolean()
  @ApiModelProperty()
  isActive: boolean = false;

  @IsOptional()
  // @FormField({
  //   label: 'Login History',
  //   type: FieldTypes.Table,
  //   fk: {
  //     account: 'accountId',
  //   },
  //   model: LOGIN_HISTORY_ENDPOINT,
  //   mode: FieldModes.View,
  // })
  loginHistories: ILoginHistoryDto[];

  role: 'admin' = ADMIN_REALM;

  realm: 'admin' = ADMIN_REALM;
}
