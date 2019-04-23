import { ApiModelProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNumber, IsString } from 'class-validator';
import { Field, InputType, Int, ObjectType } from 'type-graphql';
import { CrudDto } from '../../../../src/crud/crud.dto';
import {
  Form,
  FormField,
  FormFieldAutocomplete,
  FormFieldFk,
  FormFieldTable,
  FormFieldTextArea,
} from '../../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../../src/crud/grid.decorator';
import { FieldTypes } from '../../../../src/crud/interfaces/form.interface';
import { ColumnTypes } from '../../../../src/crud/interfaces/grid.interface';
import { Kanban } from '../../../../src/crud/kanban.decorator';
import { FileStorageDto } from '../../../../src/fileStorage/fileStorage.dto';
import { IFileStorageDto } from '../../../../src/fileStorage/interfaces/fileStorage.interface';
import { IPacketDto } from '../interfaces/packet.interface';
import { TENDER_ENDPOINT } from './interfaces/tender.const';
import { ITenderDto, TenderCategory, TenderPhases, TenderType } from './interfaces/tender.interface';
import { PARTICIPANT_ENDPOINT } from './participant/interfaces/participant.const';
import { IParticipantDto } from './participant/interfaces/participant.interface';
import { ParticipantDto } from './participant/participant.dto';

@Grid()
@Form()
@Kanban('currentPhase')
@ObjectType(TENDER_ENDPOINT)
@InputType()
export class TenderDto extends CrudDto implements ITenderDto {
  @FormFieldFk({
    fk: { packet: 'id' },
  })
  packet: IPacketDto;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Code', required: true })
  @GridColumn({ text: 'Code', searchAble: true })
  code: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Title', required: true })
  @GridColumn({ text: 'Title', searchAble: true })
  title: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormFieldTextArea({ label: 'Description', required: true })
  @GridColumn({ text: 'Description', searchAble: true })
  description: string;

  @Field(() => TenderType)
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Type',
    type: FieldTypes.Select,
    choices: Object.keys(TenderType).map(key => key),
  })
  @GridColumn({ text: 'Type' })
  type: TenderType;

  @Field(() => TenderCategory)
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Category',
    type: FieldTypes.Select,
    choices: Object.keys(TenderCategory).map(key => key),
  })
  @GridColumn({ text: 'Category' })
  category: TenderCategory;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Ownership', required: true })
  @GridColumn({ text: 'Ownership', searchAble: true })
  ownership: string;

  @Field(() => Int)
  @IsInt()
  @ApiModelProperty()
  @FormField({ label: 'Fiscal Year', required: true })
  @GridColumn({ text: 'Fiscal Year', searchAble: true })
  fiscalYear: number;

  @Field(() => Int)
  @IsNumber()
  @ApiModelProperty()
  @FormField({ label: 'Tender Price', required: true, type: FieldTypes.Money })
  @GridColumn({ text: 'Tender Price', searchAble: true, type: ColumnTypes.Money })
  tenderPrice: number;

  @Field(() => FileStorageDto)
  @FormField({
    label: 'Qualification Document',
    type: FieldTypes.Image,
    uploadUrl: TENDER_ENDPOINT + '/qualificationDocument',
  })
  qualificationDocument: IFileStorageDto;

  @Field(() => TenderPhases)
  @IsString()
  @ApiModelProperty()
  @FormField({
    label: 'Current Phase',
    type: FieldTypes.Select,
    choices: Object.keys(TenderPhases).map(key => key),
  })
  @GridColumn({ text: 'Current Phase' })
  currentPhase: TenderPhases;

  @Field(() => Date)
  @IsDate()
  @ApiModelProperty()
  @FormField({ label: 'Due Date', required: true, type: FieldTypes.Date })
  @GridColumn({ text: 'Due Date', searchAble: true, type: ColumnTypes.Date })
  dueDate: Date;

  @Field(() => [ParticipantDto])
  @ApiModelProperty()
  @FormFieldTable({
    label: 'Participants',
    fk: {
      tender: 'tenderId',
    },
    model: PARTICIPANT_ENDPOINT,
  })
  participants: IParticipantDto[];

  @Field(() => ParticipantDto)
  @ApiModelProperty()
  @FormFieldAutocomplete({
    label: 'Winner',
    type: FieldTypes.Autocomplete,
    dataSource: { url: PARTICIPANT_ENDPOINT, searchParams: ['participant.companyName'], filterBy: { id: 'tender' } },
  })
  winner: IParticipantDto;
}
