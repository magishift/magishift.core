import { IMenu } from '../src/setting/menu/interfaces/menu.interface';
import { AUTOCOMPLETE_ENDPOINT } from './modules/autocomplete/interfaces/autocomplete.const';
import { CHECKBOX_ENDPOINT } from './modules/checkbox/interfaces/checkbox.const';
import { PICKER_ENDPOINT } from './modules/picker/interfaces/picker.const';
import { SELECT_ENDPOINT } from './modules/select/interfaces/select.const';
import { TEXT_INPUT_ENDPOINT } from './modules/textInput/interfaces/textInput.const';

export const menuItems: IMenu[] = [
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
