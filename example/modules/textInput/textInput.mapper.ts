import { Injectable } from '@nestjs/common';
import { CrudMapper } from '../../../src/crud/crud.mapper';
import { ITextInput, ITextInputDto } from './interfaces/textInput.interface';
import { TextInputDto } from './textInput.dto';
import { TextInput } from './textInput.entity';

@Injectable()
export class TextInputMapper extends CrudMapper<ITextInput, ITextInputDto> {
  constructor() {
    super(TextInput, TextInputDto);
  }
}
