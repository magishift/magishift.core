import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField, FormFieldUpload } from '../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../src/crud/grid.decorator';
import { FieldTypes } from '../../../src/crud/interfaces/form.interface';
import { ColumnTypes } from '../../../src/crud/interfaces/grid.interface';
import { FileStorageDto } from '../../../src/fileStorage/fileStorage.dto';
import { IFileStorageDto } from '../../../src/fileStorage/interfaces/fileStorage.interface';
import { ClientUserDto } from '../clientUser/clientUser.dto';
import { CLIENT_USER_ENDPOINT } from '../clientUser/interfaces/clientUser.const';
import { IClientUserDto } from '../clientUser/interfaces/clientUser.interface';
import { TENANT_ENDPOINT } from './interfaces/tenant.const';
import { ITenantDto } from './interfaces/tenant.interface';

@Grid()
@Form()
@ObjectType(TENANT_ENDPOINT)
@InputType()
export class TenantDto extends CrudDto implements ITenantDto {
  @Field(() => FileStorageDto)
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

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Company Name', required: true })
  @GridColumn({ text: 'Company Name', searchAble: true })
  name: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Domain', required: true })
  @GridColumn({ text: 'Domain' })
  domain: string;

  @Field()
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

  @Field(() => ClientUserDto)
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
