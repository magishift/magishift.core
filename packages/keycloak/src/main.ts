import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import dotenv = require('dotenv');
import { KeycloakModule } from './keycloak.module';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

@Module({
  imports: [KeycloakModule],
})
class ApplicationModule {}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApplicationModule);
  await app.listen(parsed.APP_PORT);

  console.info(`Server started at http://localhost:${parsed.APP_PORT}`);
}

bootstrap();
