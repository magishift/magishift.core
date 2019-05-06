import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { IConfigOptions } from './interfaces/config.interfaces';

@Module({})
export class ConfigModule {
  static injectConfig(config: IConfigOptions): DynamicModule {
    ConfigService.setConfig = config;

    return {
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
