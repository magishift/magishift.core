import { HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { RoleMappingPayload } from 'keycloak-admin/lib/defs/roleRepresentation';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
import _ = require('lodash');
import { FindConditions, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { TokenUser } from '../auth/auth.token';
import { ITokenPayload } from '../auth/interfaces/auth.interface';
import { IKeycloakService } from '../auth/keycloak/interfaces/keycloakAdminService.interface';
import { KeycloakService } from '../auth/keycloak/keycloak.service';
import { LoginInput } from '../auth/loginData.dto';
import { SessionUtil } from '../auth/session.util';
import { DataStatus } from '../base/interfaces/base.interface';
import { CrudService } from '../crud/crud.service';
import { DraftService } from '../crud/draft/draft.service';
import { ICrudService } from '../crud/interfaces/crudService.interface';
import { IUser, IUserDto } from './interfaces/user.interface';
import { UserMapper } from './user.mapper';
import { IUserRole, IUserRoleDto } from './userRole/interfaces/userRole.interface';
import { UserRoleService } from './userRole/userRole.service';

export abstract class UserService<TEntity extends IUser, TDto extends IUserDto> extends CrudService<TEntity, TDto>
  implements ICrudService<TEntity, TDto> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly authService: AuthService,
    protected readonly keycloakAdminService: KeycloakService,
    protected readonly userRoleService: UserRoleService<IUserRole, IUserRoleDto>,
    protected readonly draftService: DraftService,
    protected readonly mapper: UserMapper<TEntity, TDto>,
    protected readonly realm: string,
  ) {
    super(repository, draftService, mapper);

    if (!realm) {
      throw new HttpException('Must set realm for User Service', 500);
    }

    UserService.updateRepository(keycloakAdminService, userRoleService, repository as Repository<IUser>, realm);
  }

  async create(user: TDto): Promise<TDto> {
    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      // check if username already used
      await this.keycloakAdminService.getAccountByName(user.username, this.realm);

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

      await this.keycloakAdminService.createAccount(keycloakUser, this.realm);

      const keycloak = await this.keycloakAdminService.getAccountByName(keycloakUser.username, this.realm);

      const keycloakRoles: RoleMappingPayload[] = user.realmRoles.map(role => {
        return { id: role.id, name: role.name };
      });

      await this.keycloakAdminService.updateAccountRoles(keycloak.id, keycloakRoles, this.realm);

      user.accountId = keycloak.id;

      const result = await super.create(user);

      if (await this.draftService.isExist(user.id)) {
        this.draftService.delete(user.id);
      }

      // commit transaction now:
      await queryRunner.commitTransaction();

      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();

      if (e.response || (e.response && (e.response.status !== 401 && e.response.status !== 409))) {
        // check if user already created
        const kyCreatedUser = await this.keycloakAdminService.getAccountByName(user.username, this.realm);

        if (kyCreatedUser) {
          await this.keycloakAdminService.deleteUserById(kyCreatedUser.id, this.realm);
        }
      }

      throw new HttpException(e.response || e, e.response ? e.response.status : e.status);
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

      await this.keycloakAdminService.updateAccount(result.accountId, keycloakUser, this.realm);

      const keycloakRoles: RoleMappingPayload[] = user.realmRoles.map(role => {
        return { id: role.id, name: role.name };
      });

      await this.keycloakAdminService.updateAccountRoles(result.accountId, keycloakRoles, this.realm);

      // commit transaction now:
      await queryRunner.commitTransaction();

      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(e.response || e, e.response ? e.response.status : e.status);
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

      await this.keycloakAdminService.deleteUserById(user.accountId, this.realm, softDelete);

      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(e.response || e, e.response ? e.response.status : e.status);
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginData: LoginInput): Promise<TokenUser> {
    const grant = await this.keycloakAdminService.login(loginData.username, loginData.password, this.realm);

    const decryptedToken: ITokenPayload = jwt.decode(grant.accessToken) as ITokenPayload;

    const user = await this.repository.findOne({ accountId: decryptedToken.sub } as FindConditions<TEntity>);

    if (!user) {
      throw new HttpException('User is not registered', 401);
    }

    return {
      accessToken: grant.accessToken,
      refreshToken: grant.refreshToken,
      ttl: decryptedToken.exp,
      userData: await this.mapper.entityToDto(user),
      accountId: user.id,
      realm: this.realm,
    };
  }

  async logout(): Promise<boolean> {
    return await this.keycloakAdminService.logout(SessionUtil.getCurrentToken, this.realm);
  }

  private static async updateRepository(
    keycloakAdminService: IKeycloakService,
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
        });

        await repository.save(user);
      }),
    );
  }
}
