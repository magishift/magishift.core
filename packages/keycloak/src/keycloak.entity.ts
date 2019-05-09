import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class KeycloakEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column()
  realm: string;

  @Column()
  resource: string;

  @Column()
  authServerUrl: string;

  @Column({ default: true })
  public: boolean;
}
