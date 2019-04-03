import { Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { User } from '../../../src/user/user.entity';
import { Tenant } from '../tenant/tenant.entity';
import { ClientUserRole } from './clientUserRole/clientUserRole.entity';
import { IClientUser } from './interfaces/clientUser.interface';

@Entity()
export class ClientUser extends User implements IClientUser {
  @ManyToOne(_ => Tenant, tenant => tenant.clientUsers)
  tenant: Tenant;

  @ManyToMany(_ => ClientUserRole, clientUserRole => clientUserRole.users)
  @JoinTable()
  realmRoles: ClientUserRole[];
}
