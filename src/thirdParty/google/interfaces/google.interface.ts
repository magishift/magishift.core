import { Credentials } from 'google-auth-library';
import { ISetting } from '../../../setting/interfaces/setting.interface';

export interface IGoogleConfigDto {
  calendarEnabled: boolean;
  mapEnabled: boolean;
  mapApiKey: string;
  clientId: string;
  redirectUris: string[];
  clientSecret: string;
  credentialToken?: IGoogleCredentialToken;
  authorizationLink: string;
  authorizationCode: string;
  scopes?: string[];
  fcmEnabled: boolean;
  fcmDatabaseUrl: string;
  fcmTokenSecret: string;
  fcmMessagingSenderId: string;
  fcmToken: string;
}

export interface IGoogleCredential {
  installed: { client_secret: string; client_id: string; redirect_uris: string[] };
}

export interface IGoogleCredentialToken {
  credential: IGoogleCredential;
  token?: Credentials;
}

export interface IGoogleConfig extends ISetting {
  service: string;
  data: IGoogleConfigDto;
}
