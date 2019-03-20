import { Controller, Get, Query } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { ExceptionHandler } from '../../utils/error.utils';
import { KEYCLOAK_ENDPOINT } from './keycloak.const';
import { KeyCloakService } from './keycloak.service';

@Controller(KEYCLOAK_ENDPOINT)
@ApiUseTags(KEYCLOAK_ENDPOINT)
export class KeycloakController {
  constructor(protected readonly service: KeyCloakService) {}

  @Get('config')
  config(): object {
    try {
      return this.service.getConfig();
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Get('loginUrl')
  async loginUrl(@Query() query: { redirect_uri: string }): Promise<any> {
    try {
      return await this.service.loginUrl(query.redirect_uri);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Get('logoutUrl')
  async logoutUrl(@Query() query: { redirect_uri: string }): Promise<any> {
    try {
      return await this.service.logoutUrl(query.redirect_uri);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
