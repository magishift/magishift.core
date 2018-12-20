import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ISetting } from './interfaces/setting.interface';

@Entity()
export class Setting implements ISetting {
  @ObjectIdColumn()
  id: string;

  @Column({ unique: true })
  service: string;

  @Column({ type: 'json' })
  data: object;
}
