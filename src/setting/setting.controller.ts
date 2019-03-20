import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { DefaultRoles } from '../auth/role/role.const';
import { Roles } from '../auth/role/roles.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { SETTING_ENDPOINT } from './interfaces/setting.const';
import { IMenu } from './menu/interfaces/menu.interface';
import { Menu } from './menu/menu.utils';

@Controller(SETTING_ENDPOINT)
@ApiUseTags(SETTING_ENDPOINT)
@UseGuards(RolesGuard)
@Roles(DefaultRoles.authenticated)
export class SettingController {
  constructor(protected readonly menu: Menu) {}

  @Get('menu')
  getMenu(): IMenu[] {
    return this.menu.getMenu;
  }
}
