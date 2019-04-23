import { Controller, Get } from '@nestjs/common';
import * as osUtils from 'os-utils';
import { ExceptionHandler } from '../utils/error.utils';

@Controller()
export class HomeController {
  @Get()
  async index(): Promise<object> {
    try {
      return {
        Application_Version: process.env.npm_package_version,
        Platform: osUtils.platform(),
        Number_of_CPUs: osUtils.cpuCount(),
        Load_Average_5m: osUtils.loadavg(5),
        Total_Memory: osUtils.totalmem() + 'MB',
        Free_Memory: osUtils.freemem() + 'MB',
        System_Uptime: osUtils.sysUptime() + 'ms',
      };
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
