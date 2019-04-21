import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../../src/crud/crud.entity';
import { IAutocomplete } from './interfaces/autocomplete.interface';

@Entity()
export class Autocomplete extends CrudEntity implements IAutocomplete {
  @Column({ nullable: true })
  data: string;
}
