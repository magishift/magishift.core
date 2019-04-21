import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../../src/crud/crud.service';
import { DraftService } from '../../../src/crud/draft/draft.service';
import { ITextInput, ITextInputDto } from './interfaces/textInput.interface';
import { TextInput } from './textInput.entity';
import { TextInputMapper } from './textInput.mapper';

@Injectable()
export class TextInputService extends CrudService<ITextInput, ITextInputDto> {
  constructor(
    @InjectRepository(TextInput) protected readonly textInputRepository: Repository<TextInput>,
    protected readonly draftService: DraftService,
    protected readonly mapper: TextInputMapper,
  ) {
    super(textInputRepository, draftService, mapper);
  }
}
