import { Injectable } from '@nestjs/common';
import { ADMIN_REALM } from '../../common/admin/interfaces/admin.const';
import { EMAIL_TEMPLATE_ENDPOINT } from '../../common/emailTemplate/interfaces/emailTemplate.const';
import { GOOGLE_CONFIG_ENDPOINT } from '../../thirdParty/google/interfaces/google.const';
import { IMenu } from './interfaces/menu.interface';

@Injectable()
export class Menu {
  private static menu: IMenu[];

  static get getMenu(): IMenu[] {
    return Menu.menu;
  }

  static setMenu(mainHeader: string, items: IMenu[]): void {
    Menu.menu = MenuFactory(mainHeader, items);
  }
}

const MenuFactory = (mainHeader: string, items: IMenu[]): IMenu[] => {
  const result = [
    {
      mainHeader,
    },

    { href: '/', title: 'Home', icon: 'home' },

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

    { header: 'Systems' },

    {
      href: '/crud/' + ADMIN_REALM,
      title: 'Admin',
      icon: 'people',
    },

    {
      title: 'Third Party Settings',
      icon: 'keyboard_arrow_right',
      items: [
        {
          href: '/form/settingAws',
          title: 'AWS API Settings',
          icon: 'build',
        },
        {
          href: '/form/' + GOOGLE_CONFIG_ENDPOINT,
          title: 'Google API Settings',
          icon: 'build',
        },
        {
          href: '/form/settingTwilio',
          title: 'Twilio API Settings',
          icon: 'build',
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
