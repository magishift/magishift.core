import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { KeycloakModule, KeycloakService } from '../src';

describe('Keycloak', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [KeycloakModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`GET /config to fetch keycloak config`, () => {
    return request(app.getHttpServer())
      .get('/config')
      .expect(200);
  });

  it(`GET /config/master to fetch keycloak master config`, () => {
    return request(app.getHttpServer())
      .get('/config/master')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
