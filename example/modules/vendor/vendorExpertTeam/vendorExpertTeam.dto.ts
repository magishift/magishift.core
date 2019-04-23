import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { CrudDto } from '../../../../src/crud/crud.dto';
import { Form, FormField, FormFieldFk, FormFieldUpload } from '../../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../../src/crud/grid.decorator';
import { FieldTypes } from '../../../../src/crud/interfaces/form.interface';
import { ColumnTypes } from '../../../../src/crud/interfaces/grid.interface';
import { IFileStorageDto } from '../../../../src/fileStorage/interfaces/fileStorage.interface';
import { IVendorDto } from '../interfaces/vendor.interface';
import { VENDOR_EXPERT_TEAM_ENDPOINT } from './interfaces/vendorExpertTeam.const';
import { IVendorExpertTeamDto } from './interfaces/vendorExpertTeam.interface';

@Grid()
@Form()
@ObjectType(VENDOR_EXPERT_TEAM_ENDPOINT)
@InputType()
export class VendorExpertTeamDto extends CrudDto implements IVendorExpertTeamDto {
  @FormFieldFk({
    fk: { vendor: 'id' },
  })
  vendor: IVendorDto;

  @ApiModelProperty()
  @FormFieldUpload({
    label: 'CV',
    type: FieldTypes.Image,
    uploadUrl: VENDOR_EXPERT_TEAM_ENDPOINT + '/cv',
  })
  @GridColumn({ text: 'CV', type: ColumnTypes.Image })
  cv: IFileStorageDto;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Name',
  })
  @GridColumn({ text: 'Name', searchAble: true })
  name: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Expertise',
  })
  @GridColumn({ text: 'Expertise', searchAble: true })
  expertise: string;
}
