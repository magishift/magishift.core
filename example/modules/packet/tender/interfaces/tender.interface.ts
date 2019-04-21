import { ICrudDto, ICrudEntity } from '../../../../../src/crud/interfaces/crud.interface';
import { IFileStorage, IFileStorageDto } from '../../../../../src/fileStorage/interfaces/fileStorage.interface';
import { IPacket, IPacketDto } from '../../interfaces/packet.interface';
import { IParticipant, IParticipantDto } from '../participant/interfaces/participant.interface';

export enum TenderType {
  'Tender' = 'Tender',
  'Non-Tender' = 'Non-Tender',
}

export enum TenderCategory {
  'Barang' = 'Barang',
  'Jasa' = 'Jasa',
}

export enum TenderPhases {
  'Progress checking' = 'Progress checking',
  'Tender announcement' = 'Tender announcement',
  'Registration' = 'Registration',
  'Qualification document submission' = 'Qualification document submission',
  'Qualification evaluation' = 'Qualification evaluation',
  'Qualification audit' = 'Qualification audit',
  'Qualification results' = 'Qualification results',
  'Qualification announcement' = 'Qualification announcement',
  'Approval/pending' = 'Approval/pending',
  'Invitation' = 'Invitation',
  'Document download' = 'Document download',
  'Aanwijzing' = 'Aanwijzing',
  'Pitch document submission' = 'Pitch document submission',
  'Pitch documents preview' = 'Pitch documents preview',
  'Pitch evaluation' = 'Pitch evaluation',
  'Results finalization' = 'Results finalization',
  'Offer evaluation finalization' = 'Offer evaluation finalization',
  'Results announcement' = 'Results announcement',
  'Winner finalization' = 'Winner finalization',
  'Winner announcement' = 'Winner announcement',
}

export interface ITender extends ICrudEntity {
  title: string;
  code: string;
  description: string;
  currentPhase: TenderPhases;
  type: TenderType;
  category: TenderCategory;
  ownership: string;
  fiscalYear: number;
  tenderPrice: number;
  qualificationDocument: IFileStorage;
  dueDate: Date;
  participants: IParticipant[];
  winner: IParticipant;
  packet: IPacket;
}

export interface ITenderDto extends ICrudDto {
  title: string;
  type: TenderType;
  code: string;
  description: string;
  currentPhase: TenderPhases;
  category: TenderCategory;
  ownership: string;
  fiscalYear: number;
  tenderPrice: number;
  qualificationDocument: IFileStorageDto;
  dueDate: Date;
  participants: IParticipantDto[];
  winner: IParticipantDto;
  packet: IPacketDto;
}
