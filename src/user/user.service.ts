import { HttpStatus } from '@nestjs/common';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { ILoginData } from '../auth/interfaces/auth.interface';
import { IKeycloakAdminService } from '../auth/keycloak/interfaces/keycloakAdminService.interface';
import { KeycloakAdminService } from '../auth/keycloak/keycloakAdmin.service';
import { DataStatus } from '../base/interfaces/base.interface';
import { CrudMapper } from '../crud/crud.mapper';
import { CrudService } from '../crud/crud.service';
import { DraftService } from '../crud/draft/draft.service';
import { ICrudService } from '../crud/interfaces/crudService.interface';
import { ExceptionHandler } from '../utils/error.utils';
import { IUser, IUserDto, IUserServiceConfig } from './interfaces/user.interface';
import { IUserRole, IUserRoleDto } from './userRole/interfaces/userRole.interface';
import { UserRoleService } from './userRole/userRole.service';

export abstract class UserService<TEntity extends IUser, TDto extends IUserDto> extends CrudService<TEntity, TDto>
  implements ICrudService<TEntity, TDto> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly authService: AuthService,
    protected readonly keycloakAdminService: KeycloakAdminService,
    protected readonly userRoleService: UserRoleService<IUserRole, IUserRoleDto>,
    protected readonly draftService: DraftService,
    protected readonly mapper: CrudMapper<TEntity, TDto>,
    protected readonly serviceConfig: IUserServiceConfig,
  ) {
    super(repository, draftService, mapper);

    if (!serviceConfig.realm) {
      return ExceptionHandler('Must set realm for User Service', 500);
    }

    UserService.updateRepository(keycloakAdminService, userRoleService, repository, serviceConfig.realm);
  }

  async create(user: TDto): Promise<TDto> {
    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      const keycloakUser: UserRepresentation = {
        username: user.username,
        enabled: true,
        emailVerified: user.emailVerified,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        realmRoles: user.realmRoles ? user.realmRoles.map(role => role.name) : [],
        credentials: [{ value: user.password, type: 'password' }],
      };

      await this.keycloakAdminService.createAccount(keycloakUser, this.serviceConfig.realm);

      const keycloak = await this.keycloakAdminService.getAccountByName(
        keycloakUser.username,
        this.serviceConfig.realm,
      );

      user.accountId = keycloak.id;

      const result = await super.create(user);

      if (await this.draftService.isExist(user.id)) {
        this.draftService.delete(user.id);
      }

      // commit transaction now:
      await queryRunner.commitTransaction();

      return result;
    } catch (e) {
      const keycloak = await this.keycloakAdminService.getAccountByName(user.username, this.serviceConfig.realm);

      if (keycloak) {
        await this.keycloakAdminService.deleteUserById(keycloak.id, this.serviceConfig.realm);
      }

      await queryRunner.rollbackTransaction();

      return ExceptionHandler(e, e.status);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, user: TDto): Promise<TDto> {
    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      const result = await super.update(id, user);

      const keycloakUser: UserRepresentation = {
        username: user.username,
        enabled: user.enabled,
        emailVerified: user.emailVerified,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        realmRoles: user.realmRoles ? user.realmRoles.map(role => role.name) : [],
      };

      if (user.password) {
        keycloakUser.credentials = [{ value: user.password, type: 'password' }];
      }

      await this.keycloakAdminService.updateAccount(result.accountId, keycloakUser, this.serviceConfig.realm);

      await this.keycloakAdminService.updateAccountRoles(result.accountId, user.realmRoles, this.serviceConfig.realm);

      // commit transaction now:
      await queryRunner.commitTransaction();

      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();

      return ExceptionHandler(e, e.status);
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
      const user = await this.findOne({ id } as any);

      await super.destroy(id);

      const softDelete = this.config.softDelete && user.__meta.dataStatus !== DataStatus.Draft && !user.isDeleted;

      await this.keycloakAdminService.deleteUserById(user.accountId, this.serviceConfig.realm, softDelete);

      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();

      return ExceptionHandler(e, e.status);
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginData: ILoginData, realm: string): Promise<any> {
    const grant = this.authService.login(loginData.password, loginData.username, realm);

    const userData = await super.findOne({ account: grant } as any);

    if (!userData) {
      return ExceptionHandler('Account is not allowed to login from this service', HttpStatus.FORBIDDEN);
    }

    return grant;
  }

  async logout(token: string, realm: string): Promise<void> {
    return this.authService.logout(token, realm);
  }

  private static async updateRepository(
    keycloakAdminService: IKeycloakAdminService,
    userRoleService: UserRoleService<IUserRole, IUserRoleDto>,
    repository: Repository<IUser>,
    realm: string,
  ): Promise<void> {
    const keycloakAccounts = await keycloakAdminService.accountsList(realm);

    const existingUsers = await repository.find();

    const differences = _.differenceBy(
      existingUsers,
      keycloakAccounts.map(account => {
        (account as any).accountId = account.id;
        return account;
      }),
      'accountId',
    );

    if (differences.length > 0) {
      differences.map(async dif => {
        await repository.update(dif.id, { isDeleted: true });
      });
    }

    await userRoleService.updateRepository();

    const existingRoles: IUserRoleDto[] = await userRoleService.findAll();

    await Promise.all(
      keycloakAccounts.map(async account => {
        const isExist = _.find(existingUsers, { accountId: account.id }) || { id: uuid() };

        const accountRoles = await keycloakAdminService.getAccountRoles(account.id, realm);

        let roles: IUserRoleDto[] = [];

        if (accountRoles && accountRoles.length > 0) {
          roles = accountRoles.map(role => {
            return _.find(existingRoles, { name: role.name });
          });
        }

        const user = await repository.create({
          id: isExist.id,
          accountId: account.id,
          firstName: account.firstName,
          lastName: account.lastName,
          username: account.username,
          enabled: account.enabled,
          emailVerified: account.emailVerified,
          email: account.email,
          isDeleted: !account.enabled,
          realmRoles: roles,
          realm,
        });

        await repository.save(user);
      }),
    );
  }
}
