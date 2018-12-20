import { HttpException, Injectable } from '@nestjs/common';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import _ = require('lodash');
import { SettingService } from '../../setting/setting.service';
import { GOOGLE_CALENDAR_SCOPES } from './googleCalendar/interfaces/googleCalendar.const';
import { IGoogleConfig, IGoogleConfigDto } from './interfaces/google.interface';

@Injectable()
export class GoogleConfigService {
  static oAuth2Client: OAuth2Client;

  constructor(protected readonly settingService: SettingService<IGoogleConfig>) {
    this.loadConfig();
  }

  async fetch(): Promise<IGoogleConfigDto> {
    const settingData = await this.settingService.fetch(this.constructor.name);
    return settingData && settingData.data;
  }

  async update(config: IGoogleConfigDto): Promise<IGoogleConfigDto> {
    if (!config.calendarEnabled && !config.mapEnabled) {
      throw new HttpException('At least 1 service, should be enabled', 400);
    }

    const currentConfigData: IGoogleConfigDto = await this.fetch();

    config.scopes = this.getConfigScope(config);

    // check if api credential changes
    if (
      config.scopes.length > 0 &&
      config.clientSecret &&
      config.clientId &&
      config.redirectUris &&
      (!_.isEqual(currentConfigData.scopes.sort(), config.scopes.sort()) ||
        currentConfigData.clientSecret !== config.clientSecret ||
        currentConfigData.clientId !== config.clientId ||
        !_.isEqual(currentConfigData.redirectUris.sort(), config.redirectUris.sort()))
    ) {
      config.credentialToken = {
        credential: {
          installed: {
            client_secret: config.clientSecret,
            client_id: config.clientId,
            redirect_uris: config.redirectUris,
          },
        },
      };
      const authorizationLink = await this.getNewAccessToken(config);

      config.authorizationLink = `<a href="${authorizationLink}" target="_blank">${authorizationLink}</a>`;
      config.authorizationCode = '';
    }

    if (config.authorizationCode && currentConfigData.authorizationCode !== config.authorizationCode) {
      config.credentialToken.token = await this.setNewAccessTokenCode(config.authorizationCode);
    } else {
      config.credentialToken.token = currentConfigData.credentialToken.token;
    }

    const newConfigData: IGoogleConfig = {
      service: this.constructor.name,
      data: config,
    };

    return (await this.settingService.write(newConfigData)).data;
  }

  /**
   * Load google configuration from db if exist
   * If not exist or defined then do nothing
   *
   * @private
   * @returns {Promise<void>}
   * @memberof this
   */
  private async loadConfig(): Promise<void> {
    const config = await this.settingService.fetch(this.constructor.name);

    if (
      config &&
      !_.isEmpty(config.data) &&
      config.data.credentialToken &&
      config.data.credentialToken.credential &&
      config.data.credentialToken.token
    ) {
      const { client_secret, client_id, redirect_uris } = config.data.credentialToken.credential.installed;
      GoogleConfigService.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, ...redirect_uris);
      GoogleConfigService.oAuth2Client.setCredentials(config.data.credentialToken.token);

      this.refreshToken(config.data);
    }
  }

  private async getNewAccessToken(config: IGoogleConfigDto): Promise<string> {
    const { client_secret, client_id, redirect_uris } = config.credentialToken.credential.installed;

    GoogleConfigService.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, ...redirect_uris);

    const authUrl = GoogleConfigService.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: config.scopes,
    });

    return authUrl;
  }

  private async setNewAccessTokenCode(credentialCode: string): Promise<Credentials> {
    const token = await GoogleConfigService.oAuth2Client.getToken(credentialCode);

    GoogleConfigService.oAuth2Client.setCredentials(token.tokens);

    return token.tokens;
  }

  private getConfigScope(config: IGoogleConfigDto): string[] {
    const scope: string[] = [];

    if (config.calendarEnabled) {
      scope.push(...GOOGLE_CALENDAR_SCOPES);
    }

    return scope;
  }

  private async refreshToken(config: IGoogleConfigDto): Promise<void> {
    const newToken = await GoogleConfigService.oAuth2Client.refreshAccessToken();
    const currentConfigData = await this.settingService.fetch(this.constructor.name);

    currentConfigData.data.credentialToken.token = newToken.credentials;

    this.settingService.write(currentConfigData);
  }
}
