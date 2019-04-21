import { Column, Entity, ManyToOne } from 'typeorm';
import { CrudEntity } from '../../../../../src/crud/crud.entity';
import { FileStorage } from '../../../../../src/fileStorage/fileStorage.entity';
import { Vendor } from '../../../vendor/vendor.entity';
import { Tender } from '../tender.entity';
import { IParticipant, ParticipantStatus } from './interfaces/participant.interface';

@Entity()
export class Participant extends CrudEntity implements IParticipant {
  @Column({ nullable: true })
  bid: number;

  @Column({ nullable: true })
  resourceTotal: number;

  @Column({ nullable: true })
  experience: number;

  @Column({ nullable: true })
  status: ParticipantStatus;

  @ManyToOne(_ => FileStorage, fileStorage => fileStorage.ownerId, { onDelete: 'RESTRICT' })
  document: FileStorage;

  @ManyToOne(_ => Vendor, vendor => vendor.participates)
  participant: Vendor;

  @ManyToOne(_ => Tender, tender => tender.participants)
  tender: Tender;
}
