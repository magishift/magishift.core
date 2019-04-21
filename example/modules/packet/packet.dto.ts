import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CrudDto } from '../../../src/crud/crud.dto';
import { Form, FormField, FormFieldTable } from '../../../src/crud/form.decorator';
import { Grid, GridColumn } from '../../../src/crud/grid.decorator';
import { IPacketDto } from './interfaces/packet.interface';
import { TENDER_ENDPOINT } from './tender/interfaces/tender.const';
import { ITenderDto } from './tender/interfaces/tender.interface';

@Grid()
@Form()
export class PacketDto extends CrudDto implements IPacketDto {
  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Title', required: true })
  @GridColumn({ text: 'Title', searchAble: true })
  title: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'RUP Code', required: true })
  @GridColumn({ text: 'RUP Code', searchAble: true })
  code: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Source Of Fund', required: true })
  @GridColumn({ text: 'Source Of Fund', searchAble: true })
  sourceOfFund: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Owner Department', required: true })
  @GridColumn({ text: 'Owner Department', searchAble: true })
  ownerDepartment: string;

  @IsString()
  @ApiModelProperty()
  @FormField({ label: 'Work Unit', required: true })
  @GridColumn({ text: 'Work Unit', searchAble: true })
  workUnit: string;

  @FormFieldTable({
    label: 'Procurement',
    fk: {
      packet: 'packetId',
    },
    model: TENDER_ENDPOINT,
  })
  tenders: ITenderDto[];
}
