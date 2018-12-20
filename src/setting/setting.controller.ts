import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { IMenu } from './menu/interfaces/menu.interface';
import { Menu } from './menu/menu.utils';

@Controller('settings')
@ApiUseTags('settings')
export class SettingController {
  @Get('menu')
  menu(): IMenu[] {
    return Menu.getMenu;
  }
}
