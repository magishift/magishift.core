import { ExceptionHandler } from '@magishift/util';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { KEYCLOAK_ENDPOINT } from './keycloak.const';
import { KeycloakService } from './keycloak.service';

@Controller(KEYCLOAK_ENDPOINT)
@ApiUseTags(KEYCLOAK_ENDPOINT)
export class KeycloakController {
  constructor(protected readonly service: KeycloakService) {}

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
}
