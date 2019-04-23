import { registerEnumType } from 'type-graphql';
import { ICrudDto, ICrudEntity } from '../../../../../src/crud/interfaces/crud.interface';
import { IFileStorage, IFileStorageDto } from '../../../../../src/fileStorage/interfaces/fileStorage.interface';
import { IPacket, IPacketDto } from '../../interfaces/packet.interface';
import { IParticipant, IParticipantDto } from '../participant/interfaces/participant.interface';

export enum TenderType {
  Tender = 'Tender',
  NonTender = 'Non-Tender',
}
registerEnumType(TenderType, { name: 'TenderType' });

export enum TenderCategory {
  Barang = 'Barang',
  Jasa = 'Jasa',
}
registerEnumType(TenderCategory, { name: 'TenderCategory' });

export enum TenderPhases {
  Progress_checking = 'Progress checking',
  Tender_announcement = 'Tender announcement',
  Registration = 'Registration',
  Qualification_document_submission = 'Qualification document submission',
  Qualification_evaluation = 'Qualification evaluation',
  Qualification_audit = 'Qualification audit',
  Qualification_results = 'Qualification results',
  Qualification_announcement = 'Qualification announcement',
  Approval_pending = 'Approval/pending',
  Invitation = 'Invitation',
  Document_download = 'Document download',
  Aanwijzing = 'Aanwijzing',
  Pitch_document_submission = 'Pitch document submission',
  Pitch_documents_preview = 'Pitch documents preview',
  Pitch_evaluation = 'Pitch evaluation',
  Results_finalization = 'Results finalization',
  Offer_evaluation_finalization = 'Offer evaluation finalization',
  Results_announcement = 'Results announcement',
  Winner_finalization = 'Winner finalization',
  Winner_announcement = 'Winner announcement',
}

registerEnumType(TenderPhases, { name: 'TenderPhases' });

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
