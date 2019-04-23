import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CrudEntity } from '../../../../src/crud/crud.entity';
import { FileStorage } from '../../../../src/fileStorage/fileStorage.entity';
import { Packet } from '../packet.entity';
import { ITender, TenderCategory, TenderPhases, TenderType } from './interfaces/tender.interface';
import { Participant } from './participant/participant.entity';

@Entity()
export class Tender extends CrudEntity implements ITender {
  @Column()
  type: TenderType;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  category: TenderCategory;

  @Column()
  description: string;

  @Column()
  ownership: string;

  @Column()
  fiscalYear: number;

  @Column()
  tenderPrice: number;

  @Column()
  qualification: string;

  @Column()
  dueDate: Date;

  @Column()
  currentPhase: TenderPhases;

  @ManyToOne(_ => FileStorage, fileStorage => fileStorage.ownerId, { onDelete: 'RESTRICT' })
  qualificationDocument: FileStorage;

  @OneToMany(_ => Participant, participant => participant.tender)
  participants: Participant[];

  @ManyToOne(_ => Participant)
  winner: Participant;

  @ManyToOne(_ => Packet)
  packet: Packet;
}
