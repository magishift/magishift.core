import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Form, FormField } from '../../../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../../../src/crud/grid.decorator';
import { FieldTypes } from '../../../../../src/crud/interfaces/form.interface';
import { IUserDto } from '../../../../../src/user/interfaces/user.interface';
import { IUserRoleDto } from '../../../../../src/user/userRole/interfaces/userRole.interface';
import { UserRoleDto } from '../../../../../src/user/userRole/userRole.dto';

@Grid()
@Form()
export class VendorUserRoleDto extends UserRoleDto implements IUserRoleDto {
  users: IUserDto[];

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Name', required: true, createOnly: true })
  @GridColumn({ text: 'Name', searchAble: true })
  name: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Description', type: FieldTypes.Text })
  @GridColumn({ text: 'Description', searchAble: true })
  description: string;
}
