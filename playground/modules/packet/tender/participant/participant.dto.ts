import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../../../../src/crud/crud.dto';
import { Form, FormField, FormFieldFk } from '../../../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../../../src/crud/grid.decorator';
import { FieldTypes, FormTypes } from '../../../../../src/crud/interfaces/form.interface';
import { ColumnTypes } from '../../../../../src/crud/interfaces/grid.interface';
import { IFileStorageDto } from '../../../../../src/fileStorage/interfaces/fileStorage.interface';
import { VENDOR_ENDPOINT } from '../../../vendor/interfaces/vendor.const';
import { IVendorDto } from '../../../vendor/interfaces/vendor.interface';
import { ITenderDto } from '../interfaces/tender.interface';
import { PARTICIPANT_ENDPOINT } from './interfaces/participant.const';
import { IParticipantDto, ParticipantStatus } from './interfaces/participant.interface';

const ParticipantStep = {
  doc: { title: '1. Uploaded Qualification Document', order: 0 },
  result: { title: '2. Review Document', order: 1 },
  rangking: { title: '3. Rangking', order: 2 },
};

@Grid()
@Form({ type: FormTypes.Wizard })
export class ParticipantDto extends CrudDto implements IParticipantDto {
  @FormFieldFk({
    label: 'Tender',
    fk: { tender: 'id' },
    wizardStep: ParticipantStep.doc,
  })
  tender: ITenderDto;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Participant',
    type: FieldTypes.Autocomplete,
    dataSource: { url: VENDOR_ENDPOINT, searchParams: ['companyName'] },
    wizardStep: ParticipantStep.doc,
  })
  @GridColumn({ text: 'Participant', searchAble: true, value: 'participant.companyName' })
  participant: IVendorDto;

  @FormField({
    label: 'Uploaded Qualification Document',
    type: FieldTypes.Image,
    uploadUrl: PARTICIPANT_ENDPOINT + '/document',
    wizardStep: ParticipantStep.doc,
  })
  document: IFileStorageDto;

  @FormField({
    label: 'Status',
    type: FieldTypes.Select,
    choices: Object.keys(ParticipantStatus).map(key => key),
    wizardStep: ParticipantStep.doc,
  })
  @GridColumn({ text: 'Status', searchAble: true })
  status: ParticipantStatus;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Bid', required: true, type: FieldTypes.Number, wizardStep: ParticipantStep.result })
  @GridColumn({ text: 'Bid', type: ColumnTypes.Number })
  bid: number;

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Resource/Man Power/Expert',
    required: true,
    type: FieldTypes.Number,
    wizardStep: ParticipantStep.result,
  })
  @GridColumn({ text: 'Resource/Man Power/Expert', type: ColumnTypes.Number })
  resourceTotal: number;

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

  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Result (%)',
    required: true,
    type: FieldTypes.Number,
    wizardStep: ParticipantStep.rangking,
  })
  @GridColumn({ text: 'Result (%)', type: ColumnTypes.Number })
  result: number;
}
