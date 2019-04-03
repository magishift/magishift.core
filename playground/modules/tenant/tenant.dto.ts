import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField } from '../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../src/crud/grid.decorator';
import { FieldTypes } from '../../../src/crud/interfaces/form.interface';
import { CLIENT_USER_ENDPOINT } from '../clientUser/interfaces/clientUser.const';
import { IClientUserDto } from '../clientUser/interfaces/clientUser.interface';
import { ITenantDto } from './interfaces/tenant.interface';

@Grid()
@Form()
export class TenantDto extends CrudDto implements ITenantDto {
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Company Name', required: true })
  @GridColumn({ text: 'Company Name', searchAble: true })
  name: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Domain', required: true })
  @GridColumn({ text: 'Domain' })
  domain: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Status' })
  @GridColumn({ text: 'Status' })
  status: string;

  @FormField({
    label: 'Admin Accounts',
    type: FieldTypes.Table,
    fk: {
      tenant: 'tenantId',
    },
    model: CLIENT_USER_ENDPOINT,
  })
  adminAccounts: IClientUserDto[];
}
