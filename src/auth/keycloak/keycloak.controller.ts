import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { ExceptionHandler } from '../../utils/error.utils';
import { KEYCLOAK_ENDPOINT } from './keycloak.const';
import { KeyCloakService } from './keycloak.service';

@Controller(KEYCLOAK_ENDPOINT)
@ApiUseTags(KEYCLOAK_ENDPOINT)
export class KeycloakController {
  constructor(protected readonly service: KeyCloakService) {}

  @Get('config')
  configMaster(): object {
    try {
      return this.service.getConfig('master');
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
  @Get('config/:realm')
  config(@Param('realm') realm: string): object {
    try {
      return this.service.getConfig(realm);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Get('loginUrl')
  async loginUrl(@Query() query: { redirect_uri: string; realm: string }): Promise<any> {
    try {
      return await this.service.loginUrl(query.redirect_uri, query.realm);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Get('logoutUrl')
  async logoutUrl(@Query() query: { redirect_uri: string; realm: string }): Promise<any> {
    try {
      return await this.service.logoutUrl(query.redirect_uri, query.realm);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
