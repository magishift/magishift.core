import { ApiModelProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { Form, FormField, FormFieldFk } from '../../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../../src/crud/grid.decorator';
import { FieldTypes } from '../../../../src/crud/interfaces/form.interface';
import { UserDto } from '../../../../src/user/user.dto';
import { IUserRoleDto } from '../../../../src/user/userRole/interfaces/userRole.interface';
import { IVendorDto } from '../interfaces/vendor.interface';
import { VendorDto } from '../vendor.dto';
import { VENDOR_USER_ENDPOINT } from './interfaces/vendorUser.const';
import { IVendorUserDto } from './interfaces/vendorUser.interface';
import { VENDOR_ROLE_ENDPOINT } from './vendorUserRole/interfaces/vendorUserRole.const';
import { VendorUserRoleDto } from './vendorUserRole/vendorUserRole.dto';

@Grid()
@Form()
@ObjectType(VENDOR_USER_ENDPOINT)
@InputType()
export class VendorUserDto extends UserDto implements IVendorUserDto {
  canLogin: boolean;

  accountId: string;

  @Field(() => VendorDto)
  @FormFieldFk({
    fk: { vendor: 'id' },
  })
  vendor: IVendorDto;

  @IsString()
  @Field(() => [VendorUserRoleDto], { nullable: true })
  @ApiModelProperty()
  @FormField({
    label: 'Roles',
    type: FieldTypes.Autocomplete,
    dataSource: { url: VENDOR_ROLE_ENDPOINT, searchParams: ['name'] },
    multiple: true,
    group: 'Credentials',
  })
  @GridColumn({ text: 'Role' })
  @Transform(role => role.string)
  realmRoles: IUserRoleDto[];
}
