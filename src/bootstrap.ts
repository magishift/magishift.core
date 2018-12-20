import { MailerModule } from '@nest-modules/mailer';
import { DynamicModule, ForwardReference, Module, Provider, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Agenda from 'agenda';
import * as Agendash from 'agendash';
import { json } from 'body-parser';
import chalk from 'chalk';
import * as express from 'express';
import { existsSync } from 'fs';
import * as graphqljs from 'graphql';
import * as GraphQlJSON from 'graphql-type-json';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import * as path from 'path';
import { createPostGraphileSchema } from 'postgraphile';
import 'reflect-metadata';
import { AccountModule } from './auth/account/account.module';
import { AuthModule } from './auth/auth.module';
import { LoginHistoryModule } from './auth/loginHistory/loginHistory.module';
import { BaseModule } from './base/base.module';
import { DateScalar } from './base/base.scalar';
import { AdminModule } from './common/admin/admin.module';
import { EmailTemplateModule } from './common/emailTemplate/emailTemplate.module';
import { SmsTemplateModule } from './common/smsTemplate/smsTemplate.module';
import { IConfigOptions } from './config/config.interfaces';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CronModule } from './cron/cron.module';
import { DraftModule } from './crud/draft/draft.module';
import { FileStorageModule } from './fileStorage/fileStorage.module';
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

  const postgresCon = `postgres://${config.db.main.username}:${config.db.main.password}@${config.db.main.host}:${
    config.db.main.port
  }/${config.db.main.database}`;

  const mainSchema = await createPostGraphileSchema(postgresCon, 'public', {
    dynamicJson: true,
  });

  const graphqlPaths: string[] = [];

  graphqlPaths.push(`${process.cwd()}/src/**/*.graphql`);

  if (existsSync('node_modules/@mandalalabs/magishift.core')) {
    graphqlPaths.push('node_modules/@mandalalabs/magishift.core/dist/**/*.graphql');
  }

  const typesArray = graphqlPaths.map(val => {
    return mergeTypes(fileLoader(val), { all: true });
  });

  const schema = mergeTypes([...typesArray, graphqljs.printSchema(mainSchema)], { all: true });

  const defaultImports = [
    BaseModule,
    HttpModule,
    TypeOrmModule.forRoot(ConfigService.getConfig.db.main),
    TypeOrmModule.forRoot(ConfigService.getConfig.db.secondary),
    SubscriptionsModule.forRoot(ConfigService.getConfig.appPort + 1),
    ConfigModule.injectConfig(ConfigService.getConfig),
    GraphQLModule.forRoot({
      resolvers: { JSON: GraphQlJSON },
      typeDefs: schema,
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
      tracing: true,
      context: ({ req }) => ({
        authScope: req.headers.authorization,
        bodyScope: req.body,
      }),
    }),
    FileStorageModule,
    LoggerModule,
    SettingModule,
    CronModule,
    EmailTemplateModule,
    SmsTemplateModule,
    AuthModule,
    AccountModule,
    LoginHistoryModule,
    AdminModule,
    DraftModule,
    GoogleConfigModule,
    GoogleCalendarModule,
    GoogleFcmModule,
    NotificationModule,
    DeviceModule,
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

  @Module({
    imports: [...defaultImports, ...imports],
    controllers,
    providers,
    exports,
    components,
  })
  class ApplicationModule {
    static AgendaInstance: Agenda;

    constructor(private readonly cron: CronModule) {
      ApplicationModule.AgendaInstance = this.agendaSetup(ConfigService.getConfig);
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

  // Bootstrap Application
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

    app.use(json({ limit: '50mb' }));

    await app.listen(ConfigService.getConfig.appPort);

    console.info(chalk.green(`Server started at ${ConfigService.getFullUrl}`));
  }

  return bootstrap();
}
