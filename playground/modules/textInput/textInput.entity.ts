import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../../src/crud/crud.entity';
import { ITextInput } from './interfaces/textInput.interface';

@Entity()
export class TextInput extends CrudEntity implements ITextInput {
  @Column({ nullable: true })
  data: string;
}
