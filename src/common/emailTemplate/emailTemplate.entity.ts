import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { IEmailTemplate } from './interfaces/emailTemplate.interface';

@Entity()
export class EmailTemplate extends CrudEntity implements IEmailTemplate {
  @Column({ unique: true })
  type: string;

  @Column()
  subject: string;

  @Column()
  template: string;
}
