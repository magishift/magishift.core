import { ApiModelProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { ILoginHistoryDto } from '../auth/loginHistory/interfaces/loginHistory.interface';
import { BackOfficeRoleDto } from '../common/backOfficeUser/backOfficeRole/backOfficeRole.dto';
import { BO_ROLE_ENDPOINT } from '../common/backOfficeUser/backOfficeRole/interfaces/backOfficeUser.const';
import { BO_USER_ENDPOINT } from '../common/backOfficeUser/interfaces/backOfficeUser.const';
import { CrudDto } from '../crud/crud.dto';
import { Form, FormField, FormFieldUpload } from '../crud/form.decorator';
import { Grid, GridColumn } from '../crud/grid.decorator';
import { FieldTypes } from '../crud/interfaces/form.interface';
import { ColumnTypes } from '../crud/interfaces/grid.interface';
import { FileStorageDto } from '../fileStorage/fileStorage.dto';
import { IFileStorageDto } from '../fileStorage/interfaces/fileStorage.interface';
import { IDeviceDto } from './device/interfaces/device.interface';
import { IUserDto } from './interfaces/user.interface';
import { INotificationDto } from './notification/interfaces/notification.interface';
import { IUserRoleDto } from './userRole/interfaces/userRole.interface';

const CREDENTIALS = 'Credentials';

@Grid()
@Form()
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export abstract class UserDto extends CrudDto implements IUserDto {
  accountId: string;

  @IsString()
  @Field(() => FileStorageDto, { nullable: true })
  @ApiModelProperty()
  @FormFieldUpload({
    label: 'Photo',
    type: FieldTypes.Image,
    uploadUrl: BO_USER_ENDPOINT + '/photo',
  })
  @GridColumn({ text: 'Photo', type: ColumnTypes.Image })
  photo: IFileStorageDto;

  @IsString()
  @Field()
  @ApiModelProperty()
  @FormField({ label: 'First Name', required: true })
  @GridColumn({ text: 'First Name', searchAble: true })
  firstName: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  @ApiModelProperty()
  @FormField({ label: 'Last Name' })
  @GridColumn({ text: 'Last Name', searchAble: true })
  lastName: string;

  @IsString()
  @Field()
  @ApiModelProperty()
  @FormField({ label: 'Phone Number' })
  @GridColumn({ text: 'Phone Number', searchAble: true })
  phoneNumber: string;

  @IsEmail()
  @Field()
  @ApiModelProperty()
  @FormField({ label: 'Email', type: FieldTypes.Email, required: true })
  @GridColumn({ text: 'Email', searchAble: true })
  email: string;

  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  @ApiModelProperty()
  @FormField({ label: 'Enabled', type: FieldTypes.Checkbox })
  enabled: boolean;

  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  @ApiModelProperty()
  @FormField({ label: 'Email Verified', type: FieldTypes.Checkbox })
  emailVerified: boolean;

  @IsString()
  @Field()
  @ApiModelProperty()
  @FormField({ label: 'Username', required: true, createOnly: true, group: CREDENTIALS })
  username: string;

  @IsString()
  @Field(() => [BackOfficeRoleDto], { nullable: true })
  @ApiModelProperty()
  @FormField({
    label: 'Roles',
    type: FieldTypes.Autocomplete,
    dataSource: { url: BO_ROLE_ENDPOINT, searchParams: ['name'] },
    multiple: true,
    group: CREDENTIALS,
  })
  @GridColumn({ text: 'Role' })
  @Transform(role => role.string)
  realmRoles: IUserRoleDto[];

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  @Exclude()
  @ApiModelProperty()
  @FormField({
    label: 'Password',
    type: FieldTypes.Password,
    required: { create: true },
    group: CREDENTIALS,
  })
  password: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  @ApiModelProperty()
  @FormField({
    label: 'Confirm Password',
    type: FieldTypes.Password,
    required: { create: true },
    group: CREDENTIALS,
  })
  @Exclude()
  passwordConfirm: string;

  loginHistories?: ILoginHistoryDto[];

  notifications: INotificationDto[];

  devices: IDeviceDto[];
}
