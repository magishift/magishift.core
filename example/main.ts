import { MagiApp } from '../src/bootstrap';
import { ConfigLoaderHelper } from '../src/config/config.helper';
import { menuItems } from './menuConfig';
// import { AutocompleteModule } from './modules/autocomplete/autocomplete.module';
// import { CheckboxModule } from './modules/checkbox/checkbox.module';
// import { ClientUserModule } from './modules/clientUser/clientUser.module';
// import { PacketModule } from './modules/packet/packet.module';
// import { PickerModule } from './modules/picker/picker.module';
// import { SelectModule } from './modules/select/select.module';
// import { TenantModule } from './modules/tenant/tenant.module';
// import { TextInputModule } from './modules/textInput/textInput.module';
// import { VendorModule } from './modules/vendor/vendor.module';

const modules = [
  // ClientUserModule,
  // TextInputModule,
  // SelectModule,
  // AutocompleteModule,
  // PickerModule,
  // CheckboxModule,
  // TenantModule,
  // VendorModule,
  // PacketModule,
];

const config = ConfigLoaderHelper(
  'Magishift Playground',
  'Magishift ^ Playground',
  menuItems,
  `${process.cwd()}/.env`,
  __dirname,
);

MagiApp(modules, config);
