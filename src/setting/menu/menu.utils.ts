import { Injectable } from '@nestjs/common';
import _ = require('lodash');
import { ROLE_ENDPOINT } from '../../auth/role/interfaces/rol.const';
import { DefaultRoles } from '../../auth/role/role.const';
import { SessionUtil } from '../../auth/session.util';
import { ADMIN_ENDPOINT } from '../../common/admin/interfaces/admin.const';
import { EMAIL_TEMPLATE_ENDPOINT } from '../../common/emailTemplate/interfaces/emailTemplate.const';
import { GOOGLE_CONFIG_ENDPOINT } from '../../thirdParty/google/interfaces/google.const';
import { IMenu } from './interfaces/menu.interface';

@Injectable()
export class Menu {
  private static menu: IMenu[];

  static get getMenu(): IMenu[] {
    const currentUserRoles = SessionUtil.getUserRoles;

    const menu = Menu.filterRole(Menu.menu, currentUserRoles);

    return menu;
  }

  static setMenu(mainHeader: string, items: IMenu[]): void {
    Menu.menu = MenuFactory(mainHeader, items);
  }

  private static filterRole(menu: IMenu[], currentUserRoles: string[]): IMenu[] {
    return _.filter(menu, (item: IMenu) => {
      if (item.items && item.items.length > 0) {
        const items = Menu.filterRole(item.items, currentUserRoles);
        item.items = items;
      }

      if (item.roles && item.roles.length > 0) {
        return item.roles.some(role => currentUserRoles.indexOf(role) >= 0);
      }

      return true;
    });
  }
}

const MenuFactory = (mainHeader: string, items: IMenu[]): IMenu[] => {
  const result = [
    {
      mainHeader,
    },

    { href: '/', title: 'Dashboard', icon: 'home', roles: [DefaultRoles.admin] },

    { divider: true },

    ...items,

    { header: 'Collaboration' },

    {
      href: '/crud/messages',
      title: 'Messages',
      icon: 'message',
    },

    {
      href: '/crud/notifications',
      title: 'Notifications',
      icon: 'notifications',
    },

    { header: 'Systems', roles: [DefaultRoles.admin] },

    {
      title: 'Security',
      icon: 'lock',
      roles: [DefaultRoles.admin],
      items: [
        {
          href: '/crud/' + ADMIN_ENDPOINT,
          title: 'Admin',
        },
        {
          href: '/crud/' + ROLE_ENDPOINT,
          title: 'Roles',
        },
      ],
    },

    {
      title: 'Third Party',
      icon: 'keyboard_arrow_right',
      roles: [DefaultRoles.admin],
      items: [
        {
          href: '/form/settingAws',
          title: 'AWS API Settings',
        },
        {
          href: '/form/' + GOOGLE_CONFIG_ENDPOINT,
          title: 'Google API Settings',
        },
        {
          href: '/form/settingTwilio',
          title: 'Twilio API Settings',
        },
      ],
    },

    {
      title: 'Templates',
      icon: 'keyboard_arrow_right',
      items: [
        {
          href: '/crud/' + EMAIL_TEMPLATE_ENDPOINT,
          title: 'Email Template',
          icon: 'email',
        },
        {
          href: '/crud/smsTemplate',
          title: 'SMS Template',
          icon: 'email',
        },
      ],
    },

    { href: '/logout', title: 'Logout', icon: 'exit_to_app' },
  ];

  return result;
};
