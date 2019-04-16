import { DefaultRoles } from '../../auth/role/defaultRoles';
import { BO_ROLE_ENDPOINT } from '../../common/backOfficeUser/backOfficeRole/interfaces/backOfficeUser.const';
import { BO_USER_ENDPOINT } from '../../common/backOfficeUser/interfaces/backOfficeUser.const';
import { EMAIL_TEMPLATE_ENDPOINT } from '../../common/emailTemplate/interfaces/emailTemplate.const';
import { REPORT_ENDPOINT } from '../../common/report/interfaces/report.const';
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

    {
      title: 'Report',
      icon: 'dashboard',
      roles: [DefaultRoles.admin],
      items: [
        {
          href: '/crud/' + REPORT_ENDPOINT,
          title: 'Manage Dashboard',
        },
      ],
    },

    { header: 'Systems', roles: [DefaultRoles.admin] },

    {
      title: 'User Management',
      icon: 'lock',
      roles: [DefaultRoles.admin],
      items: [
        {
          href: '/crud/' + BO_USER_ENDPOINT,
          title: 'Back Office User',
        },
        {
          href: '/crud/' + BO_ROLE_ENDPOINT,
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
      roles: [DefaultRoles.admin],
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
