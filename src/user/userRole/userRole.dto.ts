import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { InputType, ObjectType } from 'type-graphql';
import { CrudDto } from '../../crud/crud.dto';
import { Form, FormField } from '../../crud/form.decorator';
import { Grid, GridColumn } from '../../crud/grid.decorator';
import { FieldTypes } from '../../crud/interfaces/form.interface';
import { IUserRoleDto } from './interfaces/userRole.interface';

@Grid()
@Form()
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export abstract class UserRoleDto extends CrudDto implements IUserRoleDto {
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

  constructor(init?: Partial<UserRoleDto>) {
    super();
    Object.assign(this, init);
  }
}
