import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { DataStatus } from '../../../src/base/interfaces/base.interface';
import { ConfigLoader } from '../../../src/config/config.loader';
import { AdminModule } from '../../../src/user/admin/admin.module';
import { AdminEndpoint } from '../../../src/user/admin/interfaces/admin.interface';
import { ErrorFilter } from '../../../src/utils/error.utils';
import { MagiShiftLogger } from '../../../src/utils/logger.utils';
import dataSources from '../../dataSources';
import { admin1Mock, admin2Mock } from './admin.consts';

const Config = ConfigLoader();

describe('Admin e2e test auth and CRUD', () => {
  let app: INestApplication;
  const updatedAdminName = 'updated admin';

  beforeAll(async () => {
    console.info(`Test Config :\n${Config}`);

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSources.test), AdminModule],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalFilters(new ErrorFilter(new MagiShiftLogger(Config)));

    await app.init();
  });

  it(`/POST create new`, () => {
    return request(app.getHttpServer())
      .post(`/${AdminEndpoint}`)
      .send(admin1Mock)
      .expect(201);
  });

  it(`/GET new admin`, () => {
    return request(app.getHttpServer())
      .get(`/${AdminEndpoint}/${admin1Mock.id}`)
      .expect(200)
      .expect(resp => {
        expect(resp.body).toBeDefined();
        expect(resp.body.id).toEqual(admin1Mock.id);
        expect(resp.body.username).toEqual(admin1Mock.username);
        expect(resp.body.name).toEqual(admin1Mock.name);
        expect(resp.body.phoneNumber).toEqual(admin1Mock.phoneNumber);
        expect(resp.body.password).toBeUndefined();
      });
  });

  it(`/PATCH created admin`, () => {
    const putData = { ...admin1Mock };
    putData.name = updatedAdminName;

    return request(app.getHttpServer())
      .patch(`/${AdminEndpoint}/${putData.id}`)
      .send(putData)
      .expect(200);
  });

  it(`/GET updated admin`, () => {
    return request(app.getHttpServer())
      .get(`/${AdminEndpoint}/${admin1Mock.id}`)
      .expect(200)
      .expect(resp => {
        expect(resp.body).toBeDefined();
        expect(resp.body.name).toEqual(updatedAdminName);
        expect(resp.body.password).toBeUndefined();
      });
  });

  it(`/GET all admin`, () => {
    return request(app.getHttpServer())
      .get(`/${AdminEndpoint}`)
      .expect(200)
      .expect(resp => {
        expect(resp.body).toBeDefined();
        expect(resp.body.items.length).toEqual(1);
        expect(resp.body.totalCount).toEqual(1);
      });
  });

  describe('draft', () => {
    it(`/POST create new draft`, () => {
      return request(app.getHttpServer())
        .post(`/${AdminEndpoint}/draft`)
        .send(admin2Mock)
        .expect(201)
        .expect(resp => {
          expect(resp.body).toBeDefined();
          expect(resp.body._dataStatus).toEqual(DataStatus.Draft);
          expect(resp.body.isDeleted).toEqual(false);
        });
    });

    it(`/GET all admin draft`, () => {
      return request(app.getHttpServer())
        .get(`/${AdminEndpoint}/draft`)
        .expect(200)
        .expect(resp => {
          expect(resp.body).toBeDefined();
          expect(resp.body.items.length).toEqual(1);
          expect(resp.body.items[0]._dataStatus).toEqual(DataStatus.Draft);
          expect(resp.body.totalCount).toEqual(1);
        });
    });
  });

  describe('delete', () => {
    it(`/DELETE`, () => {
      return request(app.getHttpServer())
        .delete(`/${AdminEndpoint}/${admin1Mock.id}`)
        .expect(200)
        .expect(resp => {
          expect(resp.body).toBeDefined();
        });
    });

    it(`/GET deleted admin`, () => {
      return request(app.getHttpServer())
        .get(`/${AdminEndpoint}/${admin1Mock.id}`)
        .expect(404);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
