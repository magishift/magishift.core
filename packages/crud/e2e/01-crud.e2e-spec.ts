import dotenv = require('dotenv');

const envPath = process.env.NODE_ENV === 'test' ? '/.env.test' : '/.env';

const { parsed } = dotenv.config({
  path: process.cwd() + envPath,
});

process.env = { ...parsed, ...process.env };

import { ErrorFilter } from '@magishift/util';
import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { ITestDto } from './test/interfaces/test.interface';
import { Test as TestEntity } from './test/test.entity';
import { TestModule } from './test/test.module';

describe('Test Magi CRUD', () => {
  let app: INestApplication;

  const fixture: ITestDto = {
    testAttribute: 'Testing',
  };

  let newEntityId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [TestEntity],
          synchronize: true,
        }),
        TestModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new ErrorFilter(Logger));

    await app.init();
  });

  it(`GET /test to fetch all entities`, () =>
    request(app.getHttpServer())
      .get('/test?order=["id ASC"]&isShowDeleted=false&limit=10&relations=[]&where={}&whereOr={}')
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.totalCount).toBe('number');
        expect(Array.isArray(body.items)).toBe(true);
      }));

  it(`POST /test add new invalid entity`, () =>
    request(app.getHttpServer())
      .post('/test')
      .send({
        testAttribute: null,
      })
      .set('Accept', 'application/json')
      .expect(400));

  it(`POST /test add new entity`, () =>
    request(app.getHttpServer())
      .post('/test')
      .send(fixture)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        newEntityId = body.id;
      }));

  it(`GET /test/:id get new created entity`, () => {
    return request(app.getHttpServer())
      .get(`/test/${newEntityId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(({ body }) => {
        expect(body.id).toBe(newEntityId);
        expect(body.testAttribute).toBe(fixture.testAttribute);
      });
  });

  it(`PATCH /test update existing entity`, () => {
    const updatedFixture: ITestDto = Object.assign(fixture);

    updatedFixture.testAttribute = 'Updated test name';

    return request(app.getHttpServer())
      .patch(`/test/${newEntityId}`)
      .send(fixture)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBe(newEntityId);
        expect(body.testAttribute).toBe(updatedFixture.testAttribute);
      });
  });

  it(`DELETE /test/:id  delete new created entity`, () => {
    return request(app.getHttpServer())
      .delete(`/test/${newEntityId}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /test/deleted to fetch all deleted entities`, () =>
    request(app.getHttpServer())
      .get(`/test?order=["id"]&isShowDeleted=false&limit=1&relations=[]&where={id=${newEntityId}}&whereOr={}`)
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.totalCount).toBe('number');
        expect(Array.isArray(body.items)).toBe(true);
        expect(body.items[0].id).toBe(newEntityId);
      }));

  it(`GET /test/:id  get new created entity`, () => {
    return request(app.getHttpServer())
      .get(`/test/${newEntityId}`)
      .set('Accept', 'application/json')
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
