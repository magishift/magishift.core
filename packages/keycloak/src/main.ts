import { NestFactory } from '@nestjs/core';
import { KeycloakModule } from './keycloak.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(KeycloakModule);
  await app.listen(3000);
}

bootstrap();
