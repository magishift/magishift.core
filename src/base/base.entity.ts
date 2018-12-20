import { PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { IBaseEntity } from './interfaces/base.interface';

export abstract class BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
}
