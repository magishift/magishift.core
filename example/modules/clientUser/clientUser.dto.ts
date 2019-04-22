import { ApiModelProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { Form, FormField, FormFieldFk } from '../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../src/crud/grid.decorator';
import { FieldTypes } from '../../../src/crud/interfaces/form.interface';
import { UserDto } from '../../../src/user/user.dto';
import { IUserRoleDto } from '../../../src/user/userRole/interfaces/userRole.interface';
import { ITenantDto } from '../tenant/interfaces/tenant.interface';
import { TenantDto } from '../tenant/tenant.dto';
import { ClientUserRoleDto } from './clientUserRole/clientUserRole.dto';
import { CLIENT_ROLE_ENDPOINT } from './clientUserRole/interfaces/clientUser.const';
import { CLIENT_USER_ENDPOINT } from './interfaces/clientUser.const';
import { IClientUserDto } from './interfaces/clientUser.interface';

@Grid()
@Form()
@ObjectType(CLIENT_USER_ENDPOINT)
@InputType()
export class ClientUserDto extends UserDto implements IClientUserDto {
  accountId: string;

  @Field(() => TenantDto)
  @FormFieldFk({
    fk: { tenant: 'id' },
  })
  tenant: ITenantDto;

  @IsString()
  @Field(() => [ClientUserRoleDto], { nullable: true })
  @ApiModelProperty()
  @FormField({
    label: 'Roles',
    type: FieldTypes.Autocomplete,
    dataSource: { url: CLIENT_ROLE_ENDPOINT, searchParams: ['name'] },
    multiple: true,
    group: 'Credentials',
  })
  @GridColumn({ text: 'Role' })
  @Transform(role => role.string)
  realmRoles: IUserRoleDto[];
}
