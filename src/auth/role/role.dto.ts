import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../crud/crud.dto';
import { Form, FormField } from '../../crud/form.decorator';
import { Grid, GridColumn } from '../../crud/grid.decorator';
import { FieldTypes } from '../../crud/interfaces/form.interface';
import { IRoleDto } from './interfaces/role.interface';

@Grid()
@Form()
export class RoleDto extends CrudDto implements IRoleDto {
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Title', required: true })
  @GridColumn({ text: 'Title', searchAble: true })
  title: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Description', required: true, type: FieldTypes.Text })
  @GridColumn({ text: 'Description', searchAble: true })
  description: string;

  constructor(init?: Partial<RoleDto>) {
    super();
    Object.assign(this, init);
  }
}
