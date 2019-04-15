import { ICrudDto, ICrudEntity } from '../../../../src/crud/interfaces/crud.interface';
import { ITender, ITenderDto } from '../tender/interfaces/tender.interface';

export interface IPacket extends ICrudEntity {
  title: string;
  code: string;
  sourceOfFund: string;
  ownerDepartment: string;
  workUnit: string;
  tenders: ITender[];
}

export interface IPacketDto extends ICrudDto {
  title: string;
  code: string;
  sourceOfFund: string;
  ownerDepartment: string;
  workUnit: string;
  tenders: ITenderDto[];
}
