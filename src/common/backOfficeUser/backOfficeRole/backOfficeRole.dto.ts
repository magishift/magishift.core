import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Form, FormField } from '../../../crud/form.decorator';
import { Grid, GridColumn } from '../../../crud/grid.decorator';
import { FieldTypes } from '../../../crud/interfaces/form.interface';
import { IUserDto } from '../../../user/interfaces/user.interface';
import { IUserRoleDto } from '../../../user/userRole/interfaces/userRole.interface';
import { UserRoleDto } from '../../../user/userRole/userRole.dto';

@Grid()
@Form()
export class BackOfficeRoleDto extends UserRoleDto implements IUserRoleDto {
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
