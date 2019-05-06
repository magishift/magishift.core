import { ExceptionHandler } from '@magishift/util';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { KeycloakService } from './keycloak.service';

@Controller()
@ApiUseTags()
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
