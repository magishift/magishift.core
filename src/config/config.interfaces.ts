import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { IMenu } from '../setting/menu/interfaces/menu.interface';

export type NodeEnvType = 'development' | 'test' | 'production';

export interface IEnvConfig {
  [prop: string]: string;
}

export interface IDBConfigs {
  main: PostgresConnectionOptions;
  secondary: MongoConnectionOptions;
  [key: string]: PostgresConnectionOptions | MongoConnectionOptions;
}

export interface ITwilioConfig {
  accountSid: string;
  authToken: string;
  sendingNumber: string;
}

export interface IEmailConfig {
  username: string;
  password: string;
  host: string;
}

export interface IGraphQlConfig {
  host: string;
  port: number;
}

export interface IAwsS3 {
  bucketName: string;
  key: string;
  secrets: string;
}

export interface IConfigOptions {
  envType: NodeEnvType;
  appName: string;
  appDescription: string;
  appVersion: string;
  appPort: number;
  isHttps: boolean;
  baseUrl: string;
  db: IDBConfigs;
  jwtSecret: string;
  jwtExpiresIn: string;
  log: {
    level: NodeEnvType;
    errorPath: string;
    combinedPath: string;
  };
  menuItems: IMenu[];
  googleApiKey?: string;
  twilio?: ITwilioConfig;
  email?: IEmailConfig;
  gql: IGraphQlConfig;
  s3: IAwsS3;
  maxUploadFileSize: number;
}
