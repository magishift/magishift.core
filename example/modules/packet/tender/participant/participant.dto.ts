import { ApiModelProperty } from '@nestjs/swagger';
import { IsInstance, IsNumber, IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { CrudDto } from '../../../../../src/crud/crud.dto';
import { Form, FormField, FormFieldFk } from '../../../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../../../src/crud/grid.decorator';
import { FieldTypes, FormTypes } from '../../../../../src/crud/interfaces/form.interface';
import { ColumnTypes } from '../../../../../src/crud/interfaces/grid.interface';
import { FileStorageDto } from '../../../../../src/fileStorage/fileStorage.dto';
import { IFileStorageDto } from '../../../../../src/fileStorage/interfaces/fileStorage.interface';
import { VENDOR_ENDPOINT } from '../../../vendor/interfaces/vendor.const';
import { IVendorDto } from '../../../vendor/interfaces/vendor.interface';
import { VendorDto } from '../../../vendor/vendor.dto';
import { ITenderDto } from '../interfaces/tender.interface';
import { PARTICIPANT_ENDPOINT } from './interfaces/participant.const';
import { IParticipantDto, ParticipantStatus } from './interfaces/participant.interface';

const ParticipantStep = {
  doc: { title: '1. Uploaded Qualification Document', order: 0 },
  result: { title: '2. Review Document', order: 1 },
  score: { title: '3. Score', order: 2 },
};

@Grid()
@Form({ type: FormTypes.Wizard })
@ObjectType(PARTICIPANT_ENDPOINT)
@InputType()
export class ParticipantDto extends CrudDto implements IParticipantDto {
  @FormFieldFk({
    fk: { tender: 'id' },
  })
  tender: ITenderDto;

  @Field(() => VendorDto)
  @IsInstance(VendorDto)
  @ApiModelProperty()
  @FormField({
    label: 'Participant',
    type: FieldTypes.Autocomplete,
    dataSource: { url: VENDOR_ENDPOINT, searchParams: ['companyName'] },
    wizardStep: ParticipantStep.doc,
  })
  @GridColumn({ text: 'Participant', searchAble: true, value: 'participant.companyName' })
  participant: IVendorDto;

  @Field(() => FileStorageDto)
  @IsInstance(FileStorageDto)
  @ApiModelProperty()
  @FormField({
    label: 'Uploaded Qualification Document',
    type: FieldTypes.Image,
    uploadUrl: PARTICIPANT_ENDPOINT + '/document',
    wizardStep: ParticipantStep.doc,
  })
  document: IFileStorageDto;

  @Field(() => ParticipantStatus)
  @FormField({
    label: 'Status',
    type: FieldTypes.Select,
    choices: Object.keys(ParticipantStatus).map(key => key),
    wizardStep: ParticipantStep.doc,
  })
  @GridColumn({ text: 'Status', searchAble: true })
  status: ParticipantStatus;

  @Field()
  @IsNumber()
  @ApiModelProperty()
  @FormField({ label: 'Bid', required: true, type: FieldTypes.Number, wizardStep: ParticipantStep.result })
  @GridColumn({ text: 'Bid', type: ColumnTypes.Number })
  bid: number;

  @Field()
  @IsNumber()
  @ApiModelProperty()
  @FormField({
    label: 'Resource/Man Power/Expert',
    required: true,
    type: FieldTypes.Number,
    wizardStep: ParticipantStep.result,
  })
  @GridColumn({ text: 'Resource/Man Power/Expert', type: ColumnTypes.Number })
  resourceTotal: number;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Experience (In Year)',
    required: true,
    type: FieldTypes.Number,
    wizardStep: ParticipantStep.result,
  })
  @GridColumn({ text: 'Experience (In Year)', type: ColumnTypes.Number })
  experience: number;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Result (%)',
    required: true,
    type: FieldTypes.Number,
    wizardStep: ParticipantStep.score,
  })
  @GridColumn({ text: 'Result (%)', type: ColumnTypes.Number })
  result: number;
}
