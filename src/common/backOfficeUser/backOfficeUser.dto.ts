import { ApiModelProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { Form, FormField } from '../../crud/form.decorator';
import { Grid, GridColumn } from '../../crud/grid.decorator';
import { FieldTypes } from '../../crud/interfaces/form.interface';
import { IUserDto } from '../../user/interfaces/user.interface';
import { UserDto } from '../../user/user.dto';
import { IUserRoleDto } from '../../user/userRole/interfaces/userRole.interface';
import { BackOfficeRoleDto } from './backOfficeRole/backOfficeRole.dto';
import { BO_ROLE_ENDPOINT } from './backOfficeRole/interfaces/backOfficeUser.const';
import { BO_USER_ENDPOINT } from './interfaces/backOfficeUser.const';

@Grid()
@Form()
@ObjectType(BO_USER_ENDPOINT)
@InputType()
export class BackOfficeUserDto extends UserDto implements IUserDto {
  @IsString()
  @Field(() => [BackOfficeRoleDto], { nullable: true })
  @ApiModelProperty()
  @FormField({
    label: 'Roles',
    type: FieldTypes.Autocomplete,
    dataSource: { url: BO_ROLE_ENDPOINT, searchParams: ['name'] },
    multiple: true,
    group: 'Credentials',
  })
  @GridColumn({ text: 'Role' })
  @Transform(role => role.string)
  realmRoles: IUserRoleDto[];
}
