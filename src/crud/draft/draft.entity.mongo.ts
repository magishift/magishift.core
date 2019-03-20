import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ICrudDto } from '../interfaces/crud.interface';
import { IDraft } from './interfaces/draft.interface';

@Entity()
export class Draft implements IDraft {
  @ObjectIdColumn()
  id: string;

  @Column()
  service: string;

  @Column({ type: 'json' })
  data: ICrudDto;
}
