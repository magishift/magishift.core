import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField, FormFieldUpload } from '../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../src/crud/grid.decorator';
import { FieldTypes } from '../../../src/crud/interfaces/form.interface';
import { ColumnTypes } from '../../../src/crud/interfaces/grid.interface';
import { IFileStorageDto } from '../../../src/fileStorage/interfaces/fileStorage.interface';
import { CLIENT_USER_ENDPOINT } from '../clientUser/interfaces/clientUser.const';
import { IClientUserDto } from '../clientUser/interfaces/clientUser.interface';
import { TENANT_ENDPOINT } from './interfaces/tenant.const';
import { ITenantDto } from './interfaces/tenant.interface';

@Grid()
@Form()
export class TenantDto extends CrudDto implements ITenantDto {
  @IsString()
  @ApiModelProperty()
  @FormFieldUpload({
    label: 'Company Logo',
    type: FieldTypes.Image,
    multiple: true,
    uploadUrl: TENANT_ENDPOINT + '/logo',
  })
  @GridColumn({ type: ColumnTypes.Image, text: 'Company Logo' })
  logo: IFileStorageDto;

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
  @FormField({
    label: 'Status',
    type: FieldTypes.Select,
    choices: ['Enable', 'Disable'],
    value: 'Enable',
  })
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
