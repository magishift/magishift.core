import { ICrudDto, ICrudEntity } from '../../../../../../src/crud/interfaces/crud.interface';
import { IFileStorage, IFileStorageDto } from '../../../../../../src/fileStorage/interfaces/fileStorage.interface';
import { IVendor, IVendorDto } from '../../../../vendor/interfaces/vendor.interface';
import { ITender, ITenderDto } from '../../interfaces/tender.interface';

export enum ParticipantStatus {
  'Participated' = 'Participated',
  'Invited' = 'Invited',
  'Qualified' = 'Qualified',
  'Failed' = 'Failed',
}

export interface IParticipant extends ICrudEntity {
  tender: ITender;
  participant: IVendor;
  bid: number;
  resourceTotal: number;
  experience: number;
  document: IFileStorage;
  status: ParticipantStatus;
}

export interface IParticipantDto extends ICrudDto {
  tender: ITenderDto;
  participant: IVendorDto;
  bid: number;
  resourceTotal: number;
  experience: number;
  document: IFileStorageDto;
  status: ParticipantStatus;
}
