import { NestFactory } from '@nestjs/core';
import { Context, Handler } from 'aws-lambda';
import * as serverless from 'aws-serverless-express';
import * as express from 'express';
import { Server } from 'http';
import { KeycloakModule } from '../keycloak.module';

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
  const expressApp = express();

  return NestFactory.create(KeycloakModule)
    .then(app => app.enableCors())
    .then(app => app.init())
    .then(() => serverless.createServer(expressApp));
}

export const handler: Handler = (event: any, context: Context): any => {
  if (!cachedServer) {
    bootstrapServer().then(server => {
      cachedServer = server;
      return serverless.proxy(server, event, context);
    });
  } else {
    return serverless.proxy(cachedServer, event, context);
  }
};
