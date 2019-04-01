import { DefaultRoles } from '../src/auth/role/defaultRoles';
import { IMenu } from '../src/setting/menu/interfaces/menu.interface';
import { AUTOCOMPLETE_ENDPOINT } from './modules/autocomplete/interfaces/autocomplete.const';
import { CHECKBOX_ENDPOINT } from './modules/checkbox/interfaces/checkbox.const';
import { CLIENT_ROLE_ENDPOINT } from './modules/clientUser/clientUserRole/interfaces/clientUser.const';
import { CLIENT_USER_ENDPOINT } from './modules/clientUser/interfaces/clientUser.const';
import { PICKER_ENDPOINT } from './modules/picker/interfaces/picker.const';
import { SELECT_ENDPOINT } from './modules/select/interfaces/select.const';
import { TEXT_INPUT_ENDPOINT } from './modules/textInput/interfaces/textInput.const';

export const menuItems: IMenu[] = [
  {
    title: 'Client',
    icon: 'person',
    roles: [DefaultRoles.admin],
    items: [
      {
        href: '/crud/' + CLIENT_USER_ENDPOINT,
        title: 'Client User',
      },
      {
        href: '/crud/' + CLIENT_ROLE_ENDPOINT,
        title: 'Client Role',
      },
    ],
  },
  {
    href: '/form/' + TEXT_INPUT_ENDPOINT,
    title: 'Text Input',
    icon: 'dashboard',
  },
  {
    href: '/form/' + SELECT_ENDPOINT,
    title: 'Select',
    icon: 'dashboard',
  },
  {
    href: '/form/' + AUTOCOMPLETE_ENDPOINT,
    title: 'Autocomplete',
    icon: 'dashboard',
  },
  {
    href: '/form/' + PICKER_ENDPOINT,
    title: 'Picker',
    icon: 'dashboard',
  },
  {
    href: '/form/' + CHECKBOX_ENDPOINT,
    title: 'Checkbox',
    icon: 'dashboard',
  },
];
