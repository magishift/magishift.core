import { Injectable } from '@nestjs/common';
import _ = require('lodash');
import { SessionUtil } from '../../auth/session.util';
import { ConfigService } from '../../config/config.service';
import { IMenu } from './interfaces/menu.interface';
import { MenuFactory } from './menu.factory';

@Injectable()
export class Menu {
  private menu: IMenu[];

  get getMenu(): IMenu[] {
    if (!this.menu) {
      this.menu = MenuFactory(ConfigService.getConfig.appName, ConfigService.getConfig.menuItems);
    }

    const currentUserRoles = SessionUtil.getAccountRoles;

    return Menu.filterByRole(this.menu, currentUserRoles);
  }

  private static filterByRole(menu: IMenu[], currentUserRoles: string[]): IMenu[] {
    return _.filter(menu, (item: IMenu) => {
      if (item.items && item.items.length > 0) {
        const items = Menu.filterByRole(item.items, currentUserRoles);
        item.items = items;
      }

      if (item.roles && item.roles.length > 0) {
        if (currentUserRoles && currentUserRoles.length > 0) {
          const result = currentUserRoles.some(role => item.roles.indexOf(role) >= 0);
          return result;
        }

        return false;
      }

      return true;
    });
  }
}
