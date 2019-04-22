import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField, FormFieldTable } from '../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../src/crud/grid.decorator';
import { PACKET_ENDPOINT } from './interfaces/packet.const';
import { IPacketDto } from './interfaces/packet.interface';
import { TENDER_ENDPOINT } from './tender/interfaces/tender.const';
import { ITenderDto } from './tender/interfaces/tender.interface';
import { TenderDto } from './tender/tender.dto';

@Grid()
@Form()
@ObjectType(PACKET_ENDPOINT)
@InputType()
export class PacketDto extends CrudDto implements IPacketDto {
  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Title', required: true })
  @GridColumn({ text: 'Title', searchAble: true })
  title: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'RUP Code', required: true })
  @GridColumn({ text: 'RUP Code', searchAble: true })
  code: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Source Of Fund', required: true })
  @GridColumn({ text: 'Source Of Fund', searchAble: true })
  sourceOfFund: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Owner Department', required: true })
  @GridColumn({ text: 'Owner Department', searchAble: true })
  ownerDepartment: string;

  @Field()
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Work Unit', required: true })
  @GridColumn({ text: 'Work Unit', searchAble: true })
  workUnit: string;

  @Field(() => TenderDto)
  @FormFieldTable({
    label: 'Procurement',
    fk: {
      packet: 'packetId',
    },
    model: TENDER_ENDPOINT,
  })
  tenders: ITenderDto[];
}
