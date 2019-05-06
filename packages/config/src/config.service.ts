import { Injectable } from '@nestjs/common';
import { IConfigOptions } from './interfaces/config.interfaces';

@Injectable()
export class ConfigService {
  private static config: IConfigOptions;

  static set setConfig(config: IConfigOptions) {
    ConfigService.config = config;
  }

  static get getConfig(): IConfigOptions {
    return ConfigService.config;
  }

  static get getFullUrl(): string {
    return `${ConfigService.config.isHttps ? 'https' : 'http'}://${ConfigService.config.baseUrl}${
      Number(ConfigService.config.appPort) === 80 ? '' : ':' + ConfigService.config.appPort
    }`;
  }

  static get getGraphqlSubscriptionUrl(): string {
    return `${ConfigService.config.isHttps ? 'wss' : 'ws'}://${ConfigService.config.baseUrl}:${ConfigService.config
      .appPort + 1}/subscriptions`;
  }

  static get getMailerConfig(): string {
    return `smtps://${ConfigService.config.email.username}:${ConfigService.config.email.password}@${
      ConfigService.config.email.host
    }`;
  }
}
