import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField } from '../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../src/crud/grid.decorator';
import { FieldTypes } from '../../../src/crud/interfaces/form.interface';
import { FileStorageDto } from '../../../src/fileStorage/fileStorage.dto';
import { IFileStorageDto } from '../../../src/fileStorage/interfaces/fileStorage.interface';
import { ITenderDto } from '../packet/tender/interfaces/tender.interface';
import { IParticipantDto } from '../packet/tender/participant/interfaces/participant.interface';
import { VENDOR_ENDPOINT } from './interfaces/vendor.const';
import { IVendorDto, VendorCategory, VendorStatus, VendorType } from './interfaces/vendor.interface';
import { VENDOR_EXPERT_TEAM_ENDPOINT } from './vendorExpertTeam/interfaces/vendorExpertTeam.const';
import { IVendorExpertTeamDto } from './vendorExpertTeam/interfaces/vendorExpertTeam.interface';
import { VendorExpertTeamDto } from './vendorExpertTeam/vendorExpertTeam.dto';
import { VENDOR_USER_ENDPOINT } from './vendorUser/interfaces/vendorUser.const';
import { IVendorUserDto } from './vendorUser/interfaces/vendorUser.interface';
import { VendorUserDto } from './vendorUser/vendorUser.dto';

@Grid()
@Form()
@ObjectType(VENDOR_ENDPOINT)
@InputType()
export class VendorDto extends CrudDto implements IVendorDto {
  participates: IParticipantDto[];

  winning: ITenderDto[];

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Company Name', required: true })
  @GridColumn({ text: 'Company Name', searchAble: true })
  companyName: string;

  @Field(() => VendorType)
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Legal Type',
    type: FieldTypes.Select,
    choices: Object.keys(VendorType).map(key => key),
  })
  @GridColumn({ text: 'Legal Type', searchAble: true })
  legalType: VendorType;

  @Field(() => VendorCategory)
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Category',
    type: FieldTypes.Select,
    choices: Object.keys(VendorCategory).map(key => key),
  })
  @GridColumn({ text: 'Category', searchAble: true })
  category: VendorCategory;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Office Address', required: true })
  @GridColumn({ text: 'Office Address', searchAble: true })
  officeAddress: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Country', required: true })
  country: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Province', required: true })
  province: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'City', required: true })
  city: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'District', required: true })
  district: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Village', required: true })
  village: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Postal Code', required: true })
  postalCode: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Phone Number', required: true })
  phoneNumber: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Fax Number' })
  faxNumber: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Email', required: true, type: FieldTypes.Email })
  email: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Website', required: true })
  website: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Contact Person Name' })
  cpName: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Contact Person Phone Number' })
  cpPhoneNumber: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Contact Person Phone Email' })
  cpEmail: string;

  @Field(() => VendorStatus)
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Status',
    type: FieldTypes.Select,
    choices: Object.keys(VendorStatus).map(key => key),
  })
  @GridColumn({ text: 'Status' })
  status: VendorStatus;

  @Field(() => [VendorUserDto])
  @FormField({
    label: 'Employee',
    type: FieldTypes.Table,
    fk: {
      vendor: 'vendorId',
    },
    model: VENDOR_USER_ENDPOINT,
  })
  vendorUsers: IVendorUserDto[];

  @Field(() => [VendorExpertTeamDto])
  @FormField({
    label: 'Expert Team',
    type: FieldTypes.Table,
    fk: {
      vendor: 'vendorId',
    },
    model: VENDOR_EXPERT_TEAM_ENDPOINT,
  })
  expertTeam: IVendorExpertTeamDto[];

  @Field(() => FileStorageDto)
  @FormField({
    label: 'SIUP',
    type: FieldTypes.Image,
    uploadUrl: VENDOR_ENDPOINT + '/siup',
  })
  document: IFileStorageDto;

  @Field(() => FileStorageDto)
  @FormField({
    label: 'TDP',
    type: FieldTypes.Image,
    uploadUrl: VENDOR_ENDPOINT + '/tdp',
  })
  tdp: IFileStorageDto;

  @Field(() => FileStorageDto)
  @FormField({
    label: 'NPWP',
    type: FieldTypes.Image,
    uploadUrl: VENDOR_ENDPOINT + '/npwp',
  })
  npwp: IFileStorageDto;
}
