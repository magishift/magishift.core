import { DynamicModule, Module } from '@nestjs/common';
import { IConfigOptions } from './config.interfaces';
import { ConfigService } from './config.service';

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
