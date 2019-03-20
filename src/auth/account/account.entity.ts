import { BeforeInsert, Column, Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { IAccount } from './interfaces/account.interface';

@Entity()
export class Account extends CrudEntity implements IAccount {
  @Column({ unique: true })
  username: string;

  @Column({ default: true })
  enabled: boolean = true;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'simple-array', nullable: true })
  realmRoles: string[];

  constructor(init?: Partial<Account>) {
    super();
    Object.assign(this, init);
  }

  @BeforeInsert()
  protected beforeInsert(): void {
    this.__meta.dataOwner = this.id;

    super.beforeInsert();
  }
}
