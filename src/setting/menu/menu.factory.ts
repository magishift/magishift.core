import { ROLE_ENDPOINT } from '../../auth/role/interfaces/role.const';
import { DefaultRoles } from '../../auth/role/role.const';
import { ADMIN_ENDPOINT } from '../../common/admin/interfaces/admin.const';
import { EMAIL_TEMPLATE_ENDPOINT } from '../../common/emailTemplate/interfaces/emailTemplate.const';
import { GOOGLE_CONFIG_ENDPOINT } from '../../thirdParty/google/interfaces/google.const';
import { IMenu } from './interfaces/menu.interface';

export const MenuFactory = (appTitle: string, items: IMenu[]): IMenu[] => {
  const result = [
    {
      mainHeader: appTitle,
    },

    { href: '/', title: 'Dashboard', icon: 'home' },

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
          title: 'Back Office User',
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
