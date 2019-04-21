import chalk from 'chalk';
import dotenv = require('dotenv');
import { IMenuItems } from '../setting/menu/interfaces/menu.interface';
import { SnakeNamingStrategy } from './../database/snakeNaming';
import { IAwsS3, IConfigOptions, IDBConfigs, IEmailConfig, IGraphQlConfig, NodeEnvType } from './config.interfaces';
import { ConfigService } from './config.service';

export const ConfigLoaderHelper = (
  appName: string,
  appDescription: string,
  menuItems: IMenuItems[],
  envPath?: string,
  cwd?: string,
): IConfigOptions => {
  const { parsed } = dotenv.config({
    path: envPath || process.cwd() + '/.env',
  });

  process.env = { ...parsed, ...process.env };

  const envType: NodeEnvType = process.env.NODE_ENV as NodeEnvType;

  const isHttps: boolean = process.env.MAGISHIFT_IS_HTTPS === 'true';

  const baseUrl = process.env.MAGISHIFT_HOST;

  const appPort: number = Number(process.env.MAGISHIFT_PORT);

  const appVersion = process.env.npm_package_version;

  const entities = [`${process.cwd()}/src/modules/**/*.entity{.ts,.js}`, `${__dirname}/../**/*.entity{.ts,.js}`];

  const mongoEntities = [
    `${process.cwd()}/src/modules/**/*.entity.mongo{.ts,.js}`,
    `${__dirname}/../**/*.entity.mongo{.ts,.js}`,
  ];

  if (cwd) {
    entities.push(`${cwd}/**/*.entity{.ts,.js}`);
    mongoEntities.push(`${cwd}/**/*.entity.mongo{.ts,.js}`);
  }

  const dbConfig: IDBConfigs = {
    main: {
      type: 'postgres',
      host: process.env.MAGISHIFT_DB_HOST,
      password: process.env.MAGISHIFT_DB_PASSWORD,
      username: process.env.MAGISHIFT_DB_USER,
      database: process.env.MAGISHIFT_DB_NAME,
      port: Number(process.env.MAGISHIFT_DB_PORT),
      logging: envType !== 'production',
      synchronize: true,
      entities,
      namingStrategy: new SnakeNamingStrategy(),
      cache: {
        type: 'redis',
        options: {
          host: process.env.MAGISHIFT_REDIS_HOST,
          port: Number(process.env.MAGISHIFT_REDIS_PORT),
          duration: 30000,
        },
      },
    },
    secondary: {
      type: 'mongodb',
      name: 'mongodb',
      host: process.env.MAGISHIFT_MONGO_DB_HOST,
      password: process.env.MAGISHIFT_MONGO_DB_PASSWORD,
      username: process.env.MAGISHIFT_MONGO_DB_USER,
      database: process.env.MAGISHIFT_MONGO_DB_NAME,
      authSource: 'admin',
      // w: 1,
      port: Number(process.env.MAGISHIFT_MONGO_DB_PORT),
      synchronize: true,
      logging: envType !== 'production',
      entities: mongoEntities,
      namingStrategy: new SnakeNamingStrategy(),
    },
  };

  const googleApiKey = process.env.GOOGLE_MAP_API_KEY;

  let twilio = null;

  if (process.env.TWILIO_ACCOUNT_SID) {
    twilio = {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      sendingNumber: process.env.TWILIO_NUMBER,
    };
  } else {
    console.info(chalk.yellow(`Twilio module is not loaded. Reason: Twilio config not found or invalid`));
  }

  let email: IEmailConfig;

  if (
    process.env.MAGISHIFT_EMAIL_USERNAME &&
    process.env.MAGISHIFT_EMAIL_PASSWORD &&
    process.env.MAGISHIFT_EMAIL_HOST
  ) {
    email = {
      username: process.env.MAGISHIFT_EMAIL_USERNAME,
      password: process.env.MAGISHIFT_EMAIL_PASSWORD,
      host: process.env.MAGISHIFT_EMAIL_HOST,
    };
  } else {
    console.info(chalk.yellow(`Email module is not loaded. Reason: Email config not found or invalid`));
  }

  const logger = {
    level: envType,
    errorPath: process.env.LOGGER_FILE_ERROR_PATH,
    combinedPath: process.env.LOGGER_FILE_COMBINED_PATH,
  };

  const gql: IGraphQlConfig = {
    host: process.env.GQL_BASE_URL || 'localhost',
    port: Number(process.env.GQL_PORT) || 5000,
  };

  let s3: IAwsS3;

  if (process.env.AWS_S3_BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    s3 = {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
      key: process.env.AWS_ACCESS_KEY_ID,
      secrets: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }

  const maxUploadFileSize: number = process.env.AWS_S3_BUCKET_NAME
    ? Number(process.env.MAGISHIFT_FILE_UPLOAD_MAX_SIZE)
    : 2.5;

  ConfigService.setConfig = {
    envType,
    appName,
    appDescription,
    appVersion,
    isHttps,
    baseUrl,
    appPort,
    db: dbConfig,
    email,
    twilio,
    googleApiKey,
    log: logger,
    menuItems,
    jwtSecret: process.env.MAGISHIFT_JWT_SECRET,
    jwtExpiresIn: process.env.MAGISHIFT_JWT_EXPIRES_IN,
    gql,
    s3,
    maxUploadFileSize,
  };

  return ConfigService.getConfig;
};
