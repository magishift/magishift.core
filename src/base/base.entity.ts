import { PrimaryGeneratedColumn } from 'typeorm';
import { v4 } from 'uuid';
import { IBaseEntity } from './interfaces/base.interface';

export abstract class BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = v4();
}
