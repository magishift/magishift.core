import { Column, Entity, OneToMany } from 'typeorm';
import { CrudEntity } from '../../../src/crud/crud.entity';
import { IPacket } from './interfaces/packet.interface';
import { Tender } from './tender/tender.entity';

@Entity()
export class Packet extends CrudEntity implements IPacket {
  @Column()
  title: string;

  @Column()
  code: string;

  @Column()
  sourceOfFund: string;

  @Column()
  ownerDepartment: string;

  @Column()
  workUnit: string;

  @OneToMany(_ => Tender, tender => tender.packet)
  tenders: Tender[];
}
