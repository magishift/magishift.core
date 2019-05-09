import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Context, Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { Server } from 'http';
import { KeycloakModule } from './keycloak.module';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', reason => {
  console.error(reason);
});

process.on('uncaughtException', reason => {
  console.error(reason);
});

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    try {
      const expressApp = require('express')();

      const adapter = new ExpressAdapter(expressApp);

      const nestApp = await NestFactory.create(KeycloakModule, adapter);

      nestApp.use(eventContext());
      await nestApp.init();

      cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return Promise.resolve(cachedServer);
}

export const handler: Handler = async (event: any, context: Context): Promise<any> => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }

  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
