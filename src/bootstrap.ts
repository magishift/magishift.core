import { MailerModule } from '@nest-modules/mailer';
import { CacheInterceptor, CacheModule, DynamicModule, ForwardReference, Module, Provider, Type } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Agenda from 'agenda';
import * as Agendash from 'agendash';
import { json } from 'body-parser';
import chalk from 'chalk';
import * as compression from 'compression';
import * as express from 'express';
import * as rateLimit from 'express-rate-limit';
import * as StatusMonitor from 'express-status-monitor';
import { existsSync } from 'fs';
import * as graphqlJS from 'graphql';
import * as GraphQlJSON from 'graphql-type-json';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import * as helmet from 'helmet';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import * as path from 'path';
import 'reflect-metadata';
import { AuthModule } from './auth/auth.module';
import { LoginHistoryModule } from './auth/loginHistory/loginHistory.module';
import { BaseModule } from './base/base.module';
import { DateScalar } from './base/base.scalar';
import { BackOfficeUserModule } from './common/backOfficeUser/backOfficeUser.module';
import { EmailTemplateModule } from './common/emailTemplate/emailTemplate.module';
import { SmsTemplateModule } from './common/smsTemplate/smsTemplate.module';
import { IConfigOptions } from './config/config.interfaces';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CronModule } from './cron/cron.module';
import { DraftModule } from './crud/draft/draft.module';
import { PubSubList, PubSubProvider } from './crud/providers/pubSub.provider';
import { IRedisModuleOptions } from './database/redis/redis.interface';
import { RedisModule } from './database/redis/redis.module';
import { FileStorageModule } from './fileStorage/fileStorage.module';
import { GraphQLInstance } from './graphql/graphql.instance';
import { HttpModule } from './http/http.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerService } from './logger/logger.service';
import { SettingModule } from './setting/setting.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { GoogleConfigModule } from './thirdParty/google/google.module';
import { GoogleCalendarModule } from './thirdParty/google/googleCalendar/googleCalendar.module';
import { GoogleFcmModule } from './thirdParty/google/googleFcm/googleFcm.module';
import { DeviceModule } from './user/device/device.module';
import { NotificationModule } from './user/notification/notification.module';
import { ErrorFilter } from './utils/error.utils';

/**
 * Magishift application Bootstrapper
 *
 * @export
 * @param {(Array<Type<any> | DynamicModule | ForwardReference>)} imports
 * @param {IConfigOptions} config
 * @param {Type<any>[]} [controllers]
 * @param {Provider[]} [providers]
 * @param {(Array<DynamicModule | string | Provider | ForwardReference>)} [exports]
 * @param {Provider[]} [components]
 * @returns {Promise<any>}
 */
export async function MagiApp(
  imports: Array<Type<any> | DynamicModule | ForwardReference>,
  config: IConfigOptions,
  controllers?: Type<any>[],
  providers?: Provider[],
  exports?: Array<DynamicModule | string | Provider | ForwardReference>,
  components?: Provider[],
): Promise<any> {
  if (!ConfigService.getConfig) {
    ConfigService.setConfig = config;
  }

  await GraphQLInstance.initialize(config.db.main);

  const mainSchema = GraphQLInstance.graphqlSchema;

  const graphqlPaths: string[] = [];

  graphqlPaths.push(`${process.cwd()}/src/**/*.graphql`);

  if (existsSync('node_modules/@mandalalabs/magishift.core')) {
    graphqlPaths.push('node_modules/@mandalalabs/magishift.core/dist/**/*.graphql');
  }

  const typesArray = graphqlPaths.map(graphqlPath => {
    return mergeTypes(fileLoader(graphqlPath), { all: true });
  });

  const graphQLSchema = mergeTypes([...typesArray, PubSubList.GetPubSubSchema, graphqlJS.printSchema(mainSchema)], {
    all: true,
  });

  const redisConfig: IRedisModuleOptions = {
    host: process.env.MAGISHIFT_REDIS_HOST,
    port: Number(process.env.MAGISHIFT_REDIS_PORT),
  };

  const defaultImports = [
    BaseModule,
    HttpModule,
    TypeOrmModule.forRoot(ConfigService.getConfig.db.main),
    TypeOrmModule.forRoot(ConfigService.getConfig.db.secondary),
    SubscriptionsModule.forRoot(ConfigService.getConfig.appPort + 1),
    ConfigModule.injectConfig(ConfigService.getConfig),
    GraphQLModule.forRoot({
      resolvers: { JSON: GraphQlJSON },
      typeDefs: graphQLSchema,
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
      tracing: true,
      context: data => {
        if (data.req) {
          return {
            ...data.req,
            authScope: data.req.headers.authorization,
            authRealm: data.req.headers.realm || data.req.headers['x-realm'],
            bodyScope: data.req.body,
          };
        }

        return data;
      },
    }),
    FileStorageModule,
    LoggerModule,
    SettingModule,
    CronModule,
    EmailTemplateModule,
    SmsTemplateModule,
    AuthModule,
    LoginHistoryModule,
    BackOfficeUserModule,
    DraftModule,
    GoogleConfigModule,
    GoogleCalendarModule,
    GoogleFcmModule,
    NotificationModule,
    DeviceModule,
    RedisModule.register(redisConfig),
    CacheModule.register(),
  ];

  if (ConfigService.getConfig.email) {
    defaultImports.push(
      MailerModule.forRoot({
        transport: `smtps://${ConfigService.getConfig.email.username}:${ConfigService.getConfig.email.password}@${
          ConfigService.getConfig.email.host
        }`,
      }),
    );
  }

  if (!providers) {
    providers = [];
  }

  providers.push(DateScalar);
  providers.push(PubSubProvider);
  providers.push({ provide: APP_INTERCEPTOR, useClass: CacheInterceptor });

  if (!exports) {
    exports = [];
  }

  exports.push(PubSubProvider);

  @Module({
    imports: [...defaultImports, ...imports],
    controllers,
    providers,
    exports,
    // components,
  })
  class ApplicationModule {
    static AgendaInstance: Agenda;
    static ReflectorInstance: Reflector;

    constructor(readonly cron: CronModule, readonly reflector: Reflector) {
      ApplicationModule.AgendaInstance = this.agendaSetup(ConfigService.getConfig);
      ApplicationModule.ReflectorInstance = reflector;

      this.cron.configureAgenda(ApplicationModule.AgendaInstance);
    }

    private agendaSetup({ db }: IConfigOptions): Agenda {
      return new Agenda({
        db: {
          address: `mongodb://${db.secondary.username}:${db.secondary.password}@${db.secondary.host}:${
            db.secondary.port
          }`,
          collection: 'agendaDb',
        },
      });
    }
  }

  // Bootstrap Magi Application
  async function bootstrap(): Promise<void> {
    const appLogger = new LoggerService();

    const app = await NestFactory.create(ApplicationModule, {
      cors: true,
      logger: appLogger,
    });

    const options = new DocumentBuilder()
      .setTitle(config.appName)
      .setDescription(config.appDescription)
      .setVersion(config.appVersion)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/explorer', app, document);

    console.info(chalk.green(`Starting server...`));

    app.use('/files', express.static(path.join(process.cwd(), '/files')));

    app.use('/favicon.ico', express.static(`${__dirname}/../images/favicon.ico`));

    console.info(chalk.green(`Enabling Voyager`));
    app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));

    if (ApplicationModule.AgendaInstance) {
      app.use(
        '/dash',
        (_req, _res, next) => {
          next();
        },
        Agendash(ApplicationModule.AgendaInstance),
      );
    }

    app.useGlobalFilters(new ErrorFilter(appLogger));

    // app.useGlobalInterceptors(new AuthInterceptor(ApplicationModule.ReflectorInstance));

    app.use(json({ limit: '50mb' }));

    app.use(StatusMonitor());

    console.info(chalk.green(`Load security features: helmet, csurf, rate-limit`));

    app.use(helmet());

    // app.use(csurf());

    app.use(
      rateLimit({
        windowMs: 60 * 1000, // 1 minutes
        max: 500, // limit each IP to 00 requests per windowMs
      }),
    );

    app.use(compression());

    await app.listen(ConfigService.getConfig.appPort);

    console.info(chalk.green(`Server started at ${ConfigService.getFullUrl}`));
  }

  return bootstrap();
}
