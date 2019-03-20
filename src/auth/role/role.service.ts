import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { CrudService } from '../../crud/crud.service';
import { DraftService } from '../../crud/draft/draft.service';
import { ICrudService } from '../../crud/interfaces/crudService.interface';
import { ExceptionHandler } from '../../utils/error.utils';
import { IKeycloakAdminService, KeycloakAdminService } from '../keycloak/keycloakAdmin.service';
import { IRole, IRoleDto } from './interfaces/role.interface';
import { Role } from './role.entity';
import { RoleMapper } from './Role.mapper';

@Injectable()
export class RoleService extends CrudService<IRole, IRoleDto> implements ICrudService<IRole, IRoleDto> {
  constructor(
    @InjectRepository(Role) protected readonly repository: Repository<Role>,
    protected readonly draftService: DraftService,
    protected readonly mapper: RoleMapper,
    protected readonly keycloakAdmin: KeycloakAdminService,
  ) {
    super(repository, draftService, mapper, { softDelete: false });
    RoleService.updateRepository(keycloakAdmin, repository);
  }

  async create(data: IRoleDto): Promise<void> {
    const { name, description } = data;

    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      await super.create(data);
      await this.keycloakAdmin.createRole({ name, description });

      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw ExceptionHandler(err);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, data: IRoleDto): Promise<void> {
    const { name, description } = data;

    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      await super.update(id, data);
      await this.keycloakAdmin.updateRole(id, {
        name,
        description,
      });

      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw ExceptionHandler(err);
    } finally {
      await queryRunner.release();
    }
  }

  async destroy(id: string): Promise<void> {
    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      await super.destroy(id);
      await this.keycloakAdmin.deleteRole(id);

      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw ExceptionHandler(err);
    } finally {
      await queryRunner.release();
    }
  }

  private static async updateRepository(
    keycloakAdminService: IKeycloakAdminService,
    repository: Repository<Role>,
  ): Promise<void> {
    const roles = await keycloakAdminService.rolesList();
    const result = await repository.find();

    const differences = _.differenceBy(result, roles, 'id');

    if (differences.length > 0) {
      differences.map(async dif => {
        await repository.delete(dif.id);
      });
    }

    await Promise.all(
      roles.map(async role => {
        if (!!(await repository.findOne(role.id))) {
          const { name, description } = role;
          return await repository.update(role.id, new Role({ name, description }));
        } else {
          return await repository.save(new Role(role));
        }
      }),
    );
  }
}
