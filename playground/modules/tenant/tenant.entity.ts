import { Column, Entity, OneToMany } from 'typeorm';
import { CrudEntity } from '../../../src/crud/crud.entity';
import { ClientUser } from '../clientUser/clientUser.entity';
import { ITenant } from './interfaces/tenant.interface';

@Entity()
export class Tenant extends CrudEntity implements ITenant {
  @Column()
  name: string;

  @Column({ nullable: true })
  status: string;

  @Column()
  domain: string;

  @OneToMany(_ => ClientUser, clientUser => clientUser.tenant)
  clientUsers: ClientUser[];
}
