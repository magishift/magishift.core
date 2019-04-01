import _ = require('lodash');
import { Repository } from 'typeorm';
import { KeycloakAdminService } from '../../auth/keycloak/keycloakAdmin.service';
import { CrudService } from '../../crud/crud.service';
import { DraftService } from '../../crud/draft/draft.service';
import { ICrudService } from '../../crud/interfaces/crudService.interface';
import { ExceptionHandler } from '../../utils/error.utils';
import { IUserRole, IUserRoleDto, IUserRoleServiceConfig } from './interfaces/userRole.interface';
import { UserRoleMapper } from './UserRole.mapper';

export abstract class UserRoleService<TEntity extends IUserRole, TDto extends IUserRoleDto>
  extends CrudService<TEntity, TDto>
  implements ICrudService<TEntity, TDto> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly draftService: DraftService,
    protected readonly mapper: UserRoleMapper<TEntity, TDto>,
    protected readonly keycloakAdminService: KeycloakAdminService,
    protected readonly serviceConfig: IUserRoleServiceConfig,
  ) {
    super(repository, draftService, mapper, { softDelete: false });

    if (!serviceConfig.realm) {
      return ExceptionHandler('Must set realm for Role Service', 500);
    }
  }

  async create(data: TDto): Promise<TDto> {
    const { name, description } = data;

    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      await this.keycloakAdminService.createRole({ name, description }, this.serviceConfig.realm);

      const role = await this.keycloakAdminService.getRoleByName(name, this.serviceConfig.realm);

      data.id = role.id;

      const result = await super.create(data);

      // commit transaction now:
      await queryRunner.commitTransaction();

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      return ExceptionHandler(err);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, data: TDto): Promise<TDto> {
    const { name, description } = data;

    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      const result = await super.update(id, data);

      await this.keycloakAdminService.updateRole(
        id,
        {
          name,
          description,
        },
        this.serviceConfig.realm,
      );

      // commit transaction now:
      await queryRunner.commitTransaction();

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      return ExceptionHandler(err);
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

      await this.keycloakAdminService.deleteRole(id, this.serviceConfig.realm);

      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      return ExceptionHandler(err);
    } finally {
      await queryRunner.release();
    }
  }

  async updateRepository(): Promise<void> {
    const userRoles = await this.keycloakAdminService.rolesList(this.serviceConfig.realm);

    const existing = await this.repository.find();

    const differences = _.differenceBy(existing, userRoles, 'id');

    if (differences.length > 0) {
      differences.map(async dif => {
        await this.repository.delete(dif.id);
      });
    }

    await Promise.all(
      userRoles.map(async userRole => {
        const isExist = _.find(existing, { name: userRole.name });

        if (isExist) {
          const { name, description } = userRole;
          await this.repository.update(userRole.id, { name, description, isDeleted: false } as any);
        } else {
          const entity = await this.repository.create(userRole as any);
          await this.repository.save(entity as any);
        }
      }),
    );
  }
}
