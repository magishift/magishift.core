import { NestFactory } from '@nestjs/core';
import dotenv = require('dotenv');
import { KeycloakModule } from './keycloak.module';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(KeycloakModule);
  await app.listen(parsed.APP_PORT);

  console.info(`Server started at 0.0.0.0:${parsed.APP_PORT}`);
}

bootstrap();
