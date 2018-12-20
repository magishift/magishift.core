import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { GetFormSchema } from '../../crud/crud.util';
import { IFormSchema } from '../../crud/interfaces/form.interface';
import { ExceptionHandler } from '../../utils/error.utils';
import { GoogleConfigService } from './google.service';
import { GOOGLE_CONFIG_ENDPOINT } from './interfaces/google.const';
import { IGoogleConfigDto } from './interfaces/google.interface';

@Controller(GOOGLE_CONFIG_ENDPOINT)
export class GoogleConfigController {
  constructor(protected readonly service: GoogleConfigService) {}

  @Get('/form')
  async getFormSchema(): Promise<IFormSchema> {
    try {
      const result = Object.assign(GetFormSchema(this.constructor.name));
      result.schema.model = null;

      result.schema.model = await this.service.fetch();

      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Get()
  async get(): Promise<IGoogleConfigDto> {
    try {
      return this.service.fetch();
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Post()
  @Patch()
  async update(@Body() config: IGoogleConfigDto): Promise<IGoogleConfigDto> {
    try {
      return this.service.update(config);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
