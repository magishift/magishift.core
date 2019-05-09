import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { KeycloakModule } from '../src';

describe('Test Keycloak Endpoint', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [KeycloakModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`GET /config to fetch keycloak master config`, () => {
    return request(app.getHttpServer())
      .get('/config')
      .expect((data: { realm: string }) => data.realm === 'master')
      .expect(200);
  });

  it(`GET /config/master to fetch keycloak master config`, () => {
    return request(app.getHttpServer())
      .get('/config/master')
      .expect((data: { realm: string }) => data.realm === 'master')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
