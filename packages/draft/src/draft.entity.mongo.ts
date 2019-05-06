import { IBaseDto } from '@magishift/base';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IDraft } from './interfaces/draft.interface';

@Entity()
export class Draft implements IDraft {
  @ObjectIdColumn()
  id: string;

  @Column()
  service: string;

  @Column({ type: 'json' })
  data: IBaseDto;
}
