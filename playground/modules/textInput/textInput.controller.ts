import { Body, Controller, Post } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { ExceptionHandler } from '../../../src/utils/error.utils';
import { TEXT_INPUT_ENDPOINT } from './interfaces/textInput.const';
import { ITextInput, ITextInputDto } from './interfaces/textInput.interface';
import { TextInputMapper } from './textInput.mapper';
import { TextInputService } from './textInput.service';

@Controller(TEXT_INPUT_ENDPOINT)
export class TextInputController extends CrudControllerFactory<ITextInputDto, ITextInput>(TEXT_INPUT_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(readonly textInputService: TextInputService, protected readonly mapper: TextInputMapper) {
    super(textInputService, mapper);
  }

  @Post('calculate')
  async calculate(@Body() data: ITextInputDto): Promise<number> {
    try {
      return data.textInputMoney ? Number(data.textInputMoney) * 1000 : 0;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
