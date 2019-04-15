import { DefaultRoles } from '../src/auth/role/defaultRoles';
import { IMenu } from '../src/setting/menu/interfaces/menu.interface';
import { AUTOCOMPLETE_ENDPOINT } from './modules/autocomplete/interfaces/autocomplete.const';
import { CHECKBOX_ENDPOINT } from './modules/checkbox/interfaces/checkbox.const';
import { CLIENT_ROLE_ENDPOINT } from './modules/clientUser/clientUserRole/interfaces/clientUser.const';
import { PACKET_ENDPOINT } from './modules/packet/interfaces/packet.const';
import { TENDER_ENDPOINT } from './modules/packet/tender/interfaces/tender.const';
import { PICKER_ENDPOINT } from './modules/picker/interfaces/picker.const';
import { SELECT_ENDPOINT } from './modules/select/interfaces/select.const';
import { TENANT_ENDPOINT } from './modules/tenant/interfaces/tenant.const';
import { TEXT_INPUT_ENDPOINT } from './modules/textInput/interfaces/textInput.const';
import { VENDOR_ENDPOINT } from './modules/vendor/interfaces/vendor.const';
import { VENDOR_ROLE_ENDPOINT } from './modules/vendor/vendorUser/vendorUserRole/interfaces/vendorUser.const';

export const menuItems: IMenu[] = [
  {
    href: '/crud/' + TEXT_INPUT_ENDPOINT,
    title: 'Text Input',
    icon: 'dashboard',
  },
  {
    href: '/crud/' + SELECT_ENDPOINT,
    title: 'Select',
    icon: 'dashboard',
  },
  {
    href: '/crud/' + AUTOCOMPLETE_ENDPOINT,
    title: 'Autocomplete',
    icon: 'dashboard',
  },
  {
    href: '/crud/' + PICKER_ENDPOINT,
    title: 'Picker',
    icon: 'dashboard',
  },
  {
    href: '/crud/' + CHECKBOX_ENDPOINT,
    title: 'Checkbox',
    icon: 'dashboard',
  },
  {
    title: 'Demo Nested Table',
    icon: 'domain',
    roles: [DefaultRoles.admin],
    items: [
      {
        href: '/crud/' + TENANT_ENDPOINT,
        title: 'Manage Tenant',
      },

      {
        href: '/crud/' + CLIENT_ROLE_ENDPOINT,
        title: 'Role',
      },
    ],
  },

  {
    title: 'Demo Packet',
    icon: 'domain',
    roles: [DefaultRoles.authenticated],
    items: [
      {
        href: '/crud/' + PACKET_ENDPOINT,
        title: 'Manage Procurement Packet',
      },
      {
        href: '/crud/' + TENDER_ENDPOINT,
        title: 'Manage Procurement Progress',
      },
    ],
  },

  {
    title: 'Demo Vendor',
    icon: 'domain',
    roles: [DefaultRoles.authenticated],
    items: [
      {
        href: '/crud/' + VENDOR_ENDPOINT,
        title: 'Manage Vendor',
      },

      {
        href: '/crud/' + VENDOR_ROLE_ENDPOINT,
        title: 'Role Vendor',
      },
    ],
  },
];
