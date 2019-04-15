import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { ILoginHistoryDto } from '../../auth/loginHistory/interfaces/loginHistory.interface';
import { Form, FormField, FormFieldUpload } from '../../crud/form.decorator';
import { Grid, GridColumn } from '../../crud/grid.decorator';
import { FieldTypes } from '../../crud/interfaces/form.interface';
import { ColumnTypes } from '../../crud/interfaces/grid.interface';
import { IFileStorageDto } from '../../fileStorage/interfaces/fileStorage.interface';
import { IUserDto } from '../../user/interfaces/user.interface';
import { UserDto } from '../../user/user.dto';
import { IUserRoleDto } from '../../user/userRole/interfaces/userRole.interface';
import { BO_ROLE_ENDPOINT } from './backOfficeRole/interfaces/backOfficeUser.const';
import { BO_USER_ENDPOINT } from './interfaces/backOfficeUser.const';

const CREDENTIAL = 'Credentials';

@Grid()
@Form()
export class BackOfficeUserDto extends UserDto implements IUserDto {
  accountId: string;

  @IsString()
  @ApiModelProperty()
  @FormFieldUpload({
    label: 'Photo',
    type: FieldTypes.Image,
    uploadUrl: BO_USER_ENDPOINT + '/photo',
  })
  @GridColumn({ text: 'Photo', type: ColumnTypes.Image })
  photo: IFileStorageDto;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'First Name', required: true })
  @GridColumn({ text: 'First Name', searchAble: true })
  firstName: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Last Name' })
  @GridColumn({ text: 'Last Name', searchAble: true })
  lastName: string;

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

  @IsBoolean()
  @FormField({ label: 'Enabled', type: FieldTypes.Checkbox })
  enabled: boolean;

  @IsBoolean()
  @FormField({ label: 'Email Verified', type: FieldTypes.Checkbox })
  emailVerified: boolean;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Username', required: true, createOnly: true, group: CREDENTIAL })
  username: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Roles',
    type: FieldTypes.Autocomplete,
    dataSource: { url: BO_ROLE_ENDPOINT, searchParams: ['name'] },
    multiple: true,
    group: CREDENTIAL,
  })
  @GridColumn({ text: 'Role', value: 'roles.name' })
  realmRoles: IUserRoleDto[];

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Password',
    type: FieldTypes.Password,
    required: { create: true },
    group: CREDENTIAL,
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Confirm Password',
    type: FieldTypes.Password,
    required: { create: true },
    group: CREDENTIAL,
  })
  passwordConfirm: string;

  @IsOptional()
  loginHistories: ILoginHistoryDto[];
}
