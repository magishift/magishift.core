// import dotenv = require('dotenv');

// const envPath = process.env.NODE_ENV === 'test' ? '/.env.test' : '/.env';

// const { parsed } = dotenv.config({
//   path: process.cwd() + envPath,
// });

// process.env = { ...parsed, ...process.env };

// import { ErrorFilter } from '@magishift/util';
// import { HttpModule, INestApplication, Logger } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import * as request from 'supertest';
// import {
//   EInstitutionTypes,
//   IOrganization
// } from '../src/interfaces/organization.interface';
// import { OrganizationController } from '../src/organization.controller';
// import { Organization } from '../src/organization.entity';
// import { OrganizationMapper } from '../src/organization.mapper';
// import { OrganizationService } from '../src/organization.service';

// describe('Test Organization CRUD', () => {
//   let app: INestApplication;

//   const fixture: IOrganization = {
//     institutionType: EInstitutionTypes.sekolah,
//     name: 'Test',
//     totalStudent: 10,
//     province: 'Jakarta',
//     city: 'Jakarta Selatan',
//     address: 'Tebet',
//     picName: 'Test PIC',
//     picKtpNumber: 'PIC01234',
//     phoneNumber: '08123456789',
//     email: 'test@test.com',
//     akta: '123456',
//     skKemenkumham: '123456',
//     skdp: '123456',
//     tdp: '123456',
//     siup: '123456',
//     npwp: '123456',
//     directorKtpNumber: '123456',
//   };

//   let newOrganizationId: string;

//   beforeAll(async () => {
//     const module = await Test.createTestingModule({
//       imports: [
//         TypeOrmModule.forRoot({
//           type: 'sqlite',
//           database: ':memory:',
//           entities: [Organization],
//           synchronize: true,
//         }),
//         TypeOrmModule.forFeature([Organization]),
//         HttpModule,
//       ],
//       controllers: [OrganizationController],
//       providers: [OrganizationService, OrganizationMapper],
//     }).compile();

//     app = module.createNestApplication();
//     app.useGlobalFilters(new ErrorFilter(Logger));

//     await app.init();
//   });

//   it(`GET /organization to fetch all organizations`, () =>
//     request(app.getHttpServer())
//       .get('/organization')
//       .expect(200)
//       .then(({ body }) => {
//         expect(typeof body.totalCount).toBe('number');
//         expect(Array.isArray(body.items)).toBe(true);
//       }));

//   it(`POST /organization add new organization`, () =>
//     request(app.getHttpServer())
//       .post('/organization')
//       .send(fixture)
//       .set('Accept', 'application/json')
//       .expect(201)
//       .then(({ body }) => {
//         expect(body.id).toBeDefined();
//         newOrganizationId = body.id;
//       }));

//   it(`GET /organization/:id  get new created organization`, () => {
//     return request(app.getHttpServer())
//       .get(`/organization/${newOrganizationId}`)
//       .set('Accept', 'application/json')
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then(({ body }) => {
//         expect(body.id).toBe(newOrganizationId);
//         expect(body.name).toBe(fixture.name);
//       });
//   });

//   it(`PATCH /organization update existing organization`, () => {
//     const updatedFixture = Object.assign(fixture);

//     updatedFixture.name = 'Updated test name';

//     return request(app.getHttpServer())
//       .patch(`/organization/${newOrganizationId}`)
//       .send(fixture)
//       .set('Accept', 'application/json')
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.id).toBe(newOrganizationId);
//         expect(body.name).toBe(updatedFixture.name);
//       });
//   });

//   it(`DELETE /organization/:id  delete new created organization`, () => {
//     return request(app.getHttpServer())
//       .delete(`/organization/${newOrganizationId}`)
//       .set('Accept', 'application/json')
//       .expect(200);
//   });

//   it(`GET /organization/:id  get new created organization`, () => {
//     return request(app.getHttpServer())
//       .get(`/organization/${newOrganizationId}`)
//       .set('Accept', 'application/json')
//       .expect(404);
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
