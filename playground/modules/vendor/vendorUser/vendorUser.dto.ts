import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { ILoginHistoryDto } from '../../../../src/auth/loginHistory/interfaces/loginHistory.interface';
import { Form, FormField } from '../../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../../src/crud/grid.decorator';
import { FieldTypes } from '../../../../src/crud/interfaces/form.interface';
import { ColumnTypes } from '../../../../src/crud/interfaces/grid.interface';
import { IFileStorageDto } from '../../../../src/fileStorage/interfaces/fileStorage.interface';
import { UserDto } from '../../../../src/user/user.dto';
import { IUserRoleDto } from '../../../../src/user/userRole/interfaces/userRole.interface';
import { CLIENT_ROLE_ENDPOINT } from '../../clientUser/clientUserRole/interfaces/clientUser.const';
import { IVendorDto } from '../interfaces/vendor.interface';
import { VENDOR_USER_ENDPOINT } from './interfaces/vendorUser.const';
import { IVendorUserDto } from './interfaces/vendorUser.interface';

const CREDENTIAL = 'Credentials';

@Grid()
@Form()
export class VendorUserDto extends UserDto implements IVendorUserDto {
  canLogin: boolean;

  accountId: string;

  @FormField({
    label: 'Vendor',
    type: FieldTypes.Fk,
    fk: { vendor: 'id' },
  })
  vendor: IVendorDto;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Photo',
    type: FieldTypes.Image,
    uploadUrl: VENDOR_USER_ENDPOINT + '/photo',
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
    dataSource: { url: CLIENT_ROLE_ENDPOINT, searchParams: ['name'] },
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
