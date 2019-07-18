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
import { CatDto } from './cat/cat.dto';
import { Cat } from './cat/cat.entity';
import { CatModule } from './cat/cat.module';

describe('Cat Magi CRUD', () => {
  let app: INestApplication;

  const fixture: Partial<CatDto> = {
    catAttribute: 'Miaaaau',
  };

  let newEntityId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Cat],
          synchronize: true,
        }),
        CatModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new ErrorFilter(Logger));

    await app.init();
  });

  it(`GET /cat to fetch all entities`, () =>
    request(app.getHttpServer())
      .get('/cat?order=["id ASC"]&limit=10&relations=[]&where={}&whereOr={}')
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.totalRecords).toBe('number');
        expect(Array.isArray(body.items)).toBe(true);
      }));

  it(`POST /cat add new invalid entity`, () =>
    request(app.getHttpServer())
      .post('/cat')
      .send({
        catAttribute: null,
      })
      .set('Accept', 'application/json')
      .expect(400));

  it(`POST /cat add new entity`, () =>
    request(app.getHttpServer())
      .post('/cat')
      .send(fixture)
      .set('Accept', 'application/json')
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        newEntityId = body.id;
      }));

  it(`GET /cat/:id get new created entity`, () => {
    return request(app.getHttpServer())
      .get(`/cat/${newEntityId}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(({ body }) => {
        expect(body.id).toBe(newEntityId);
        expect(body.catAttribute).toBe(fixture.catAttribute);
      });
  });

  it(`PATCH /cat update existing entity`, () => {
    const updatedFixture: CatDto = Object.assign(fixture);

    updatedFixture.catAttribute = 'Updated test name';

    return request(app.getHttpServer())
      .patch(`/cat/${newEntityId}`)
      .send(fixture)
      .set('Accept', 'application/json')
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBe(newEntityId);
        expect(body.catAttribute).toBe(updatedFixture.catAttribute);
      });
  });

  it(`DELETE /cat/:id  delete new created entity`, () => {
    return request(app.getHttpServer())
      .delete(`/cat/${newEntityId}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /cat/deleted to fetch all deleted entities`, () =>
    request(app.getHttpServer())
      .get(`/cat/deleted?order=["id"]&limit=1&relations=[]&where={"id":"${newEntityId}"}&whereOr={}`)
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.totalRecords).toBe('number');
        expect(Array.isArray(body.items)).toBe(true);
        expect(body.items[0].id).toBe(newEntityId);
      }));

  it(`GET /cat/deleted/:id get new deleted entity`, () => {
    return request(app.getHttpServer())
      .get(`/cat/deleted/${newEntityId}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it(`GET /cat/:id get new deleted entity`, () => {
    return request(app.getHttpServer())
      .get(`/cat/${newEntityId}`)
      .set('Accept', 'application/json')
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
