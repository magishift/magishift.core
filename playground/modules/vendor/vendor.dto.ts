import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField } from '../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../src/crud/grid.decorator';
import { FieldTypes } from '../../../src/crud/interfaces/form.interface';
import { IFileStorageDto } from '../../../src/fileStorage/interfaces/fileStorage.interface';
import { IUserDto } from '../../../src/user/interfaces/user.interface';
import { ITenderDto } from '../packet/tender/interfaces/tender.interface';
import { IParticipantDto } from '../packet/tender/participant/interfaces/participant.interface';
import { VENDOR_ENDPOINT } from './interfaces/vendor.const';
import { IVendorDto, VendorCategory, VendorStatus, VendorType } from './interfaces/vendor.interface';
import { VENDOR_USER_ENDPOINT } from './vendorUser/interfaces/vendorUser.const';
import { IVendorUserDto } from './vendorUser/interfaces/vendorUser.interface';

@Grid()
@Form()
export class VendorDto extends CrudDto implements IVendorDto {
  participates: IParticipantDto[];

  winning: ITenderDto[];

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Company Name', required: true })
  @GridColumn({ text: 'Company Name', searchAble: true })
  companyName: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Legal Type',
    type: FieldTypes.Select,
    choices: Object.keys(VendorType).map(key => key),
  })
  @GridColumn({ text: 'Legal Type', searchAble: true })
  legalType: VendorType;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Category',
    type: FieldTypes.Select,
    choices: Object.keys(VendorCategory).map(key => key),
  })
  @GridColumn({ text: 'Legal Type', searchAble: true })
  category: VendorCategory;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Office Address', required: true })
  @GridColumn({ text: 'Office Address', searchAble: true })
  officeAddress: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Country', required: true })
  country: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Province', required: true })
  province: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'City', required: true })
  city: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'District', required: true })
  district: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Village', required: true })
  village: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Postal Code', required: true })
  postalCode: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Phone Number', required: true })
  phoneNumber: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Fax Number' })
  faxNumber: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Email', required: true, type: FieldTypes.Email })
  email: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Website', required: true })
  website: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Contact Person Name' })
  cpName: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Contact Person Phone Number' })
  cpPhoneNumber: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Contact Person Phone Email' })
  cpEmail: string;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Status',
    type: FieldTypes.Select,
    choices: Object.keys(VendorStatus).map(key => key),
  })
  @GridColumn({ text: 'Status' })
  status: VendorStatus;

  @FormField({
    label: 'Employee',
    type: FieldTypes.Table,
    fk: {
      vendor: 'vendorId',
    },
    model: VENDOR_USER_ENDPOINT,
  })
  vendorUsers: IVendorUserDto[];

  @FormField({
    label: 'Expert Team',
    type: FieldTypes.Table,
    fk: {
      vendor: 'vendorId',
    },
    model: VENDOR_USER_ENDPOINT,
  })
  expertTeam: IUserDto[];

  @FormField({
    label: 'SIUP',
    type: FieldTypes.Image,
    uploadUrl: VENDOR_ENDPOINT + '/siup',
  })
  document: IFileStorageDto;

  @FormField({
    label: 'TDP',
    type: FieldTypes.Image,
    uploadUrl: VENDOR_ENDPOINT + '/tdp',
  })
  tdp: IFileStorageDto;

  @FormField({
    label: 'NPWP',
    type: FieldTypes.Image,
    uploadUrl: VENDOR_ENDPOINT + '/npwp',
  })
  npwp: IFileStorageDto;
}
