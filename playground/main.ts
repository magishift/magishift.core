import { MagiApp } from '../src/bootstrap';
import { ConfigLoaderHelper } from '../src/config/config.helper';
import { menuItems } from './menuConfig';
import { AutocompleteModule } from './modules/autocomplete/autocomplete.module';
import { CheckboxModule } from './modules/checkbox/checkbox.module';
import { ClientUserModule } from './modules/clientUser/clientUser.module';
import { PickerModule } from './modules/picker/picker.module';
import { SelectModule } from './modules/select/select.module';
import { TextInputModule } from './modules/textInput/textInput.module';

const modules = [ClientUserModule, TextInputModule, SelectModule, AutocompleteModule, PickerModule, CheckboxModule];

const config = ConfigLoaderHelper(
  'Magishift Playground',
  'Magishift ^ Playground',
  menuItems,
  `${process.cwd()}/.env`,
  __dirname,
);

MagiApp(modules, config);
