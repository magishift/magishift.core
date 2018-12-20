import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as _ from 'lodash';
import {
  DeepPartial,
  FindManyOptions,
  QueryRunner,
  RemoveOptions,
  SaveOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { DataStatus } from '../../../src/base/interfaces/base.interface';
import { IRepository } from '../../../src/database/interfaces/repository.interface';
import { Admin } from '../../../src/user/admin/admin.entity';
import { AdminMapper } from '../../../src/user/admin/admin.mapper';
import { AdminService } from '../../../src/user/admin/admin.service';
import { IAdmin } from '../../../src/user/admin/interfaces/admin.interface';
import { admin1Mock, admin2Mock, adminsMock } from './admin.consts';

describe('AdminService', () => {
  let adminService: AdminService;

  const mockRepository: IRepository<IAdmin> = {
    metadata: {
      name: 'AdminRepositoryMock',
    },
    count: async (
      options?: FindManyOptions<IAdmin> | DeepPartial<IAdmin>,
    ): Promise<number> => adminsMock.length,
    createQueryBuilder: (
      alias?: string,
      queryRunner?: QueryRunner,
    ): SelectQueryBuilder<IAdmin> => {
      const mockBuilder = {
        getMany: async () => {
          return adminsMock;
        },
        offset: () => {
          return mockBuilder;
        },
        limit: () => {
          return mockBuilder;
        },
        andWhere: () => {
          return mockBuilder;
        },
        map: () => {
          return mockBuilder;
        },
      };

      return mockBuilder as any;
    },
    findOneById: async (id: string): Promise<IAdmin> => {
      return _.find(adminsMock, { id });
    },
    save: async <T extends DeepPartial<IAdmin>>(
      entity: T | T[],
      options?: SaveOptions,
    ): Promise<T | T[]> => {
      return entity;
    },
    updateById: async (
      id: string,
      partialEntity: DeepPartial<IAdmin>,
      options?: SaveOptions,
    ): Promise<void> => {
      return;
    },
    deleteById: (id: string, options?: RemoveOptions): Promise<void> => {
      return;
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockRepository,
        },
        {
          provide: AdminMapper,
          useValue: new AdminMapper(),
        },
      ],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
  });

  describe('findById', () => {
    it('should return an Admin with a valid id', async () => {
      const expected = admin1Mock;
      const result = await adminService.findById(expected.id);
      expect(result.id).toBe(expected.id);
    });
  });

  describe('findByAll', () => {
    it('should return all Admins', async () => {
      const expected = adminsMock.map(async admin => {
        const { password, ..._admin } = admin;
        return adminService.mapper.dtoFromObject(_admin);
      });
      const result = await adminService.findAll();

      expect(result.length).toBe(expected.length);
      expect(result[0].id).toBe((await expected[0]).id);
    });
  });

  describe('create', () => {
    it('should return newly created Admin', async () => {
      const expected = await adminService.mapper.dtoFromObject(admin1Mock);
      const result = await adminService.create(expected);

      expect(result.id).toBe(expected.id);
      expect(result._dataStatus).toBe(DataStatus.Submitted);
    });
  });

  describe('update', () => {
    it('should return updated Admin', async () => {
      const expected = await adminService.mapper.dtoFromObject(admin1Mock);
      const result = await adminService.update(expected.id, expected);

      expect(result.id).toBe(expected.id);
    });
  });

  describe('draft', () => {
    it('should create Admin with _dataStatus === draft', async () => {
      const expected = await adminService.mapper.dtoFromObject(admin2Mock);
      const result = await adminService.draft(expected);

      expect(result.id).toBe(expected.id);
      expect(result._dataStatus).toBe(DataStatus.Draft);
    });
  });

  describe('delete', () => {
    it('should return deleted admin', async () => {
      const expected = await adminService.mapper.dtoFromObject(admin1Mock);
      const result = await adminService.destroy(expected.id);

      expect(result).toBe(true);
    });
  });
});
