import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { CrudService } from '../../crud/crud.service';
import { DraftService } from '../../crud/draft/draft.service';
import { ExceptionHandler } from '../../utils/error.utils';
import { AuthService } from '../auth.service';
import { IKeycloakAdminService, KeycloakAdminService } from '../keycloak/keycloakAdmin.service';
import { Account } from './account.entity';
import { AccountMapper } from './account.mapper';
import { IAccount, IAccountDto } from './interfaces/account.interface';

@Injectable()
export class AccountService extends CrudService<IAccount, IAccountDto> {
  constructor(
    @InjectRepository(Account) protected readonly repository: Repository<Account>,
    protected readonly authService: AuthService,
    protected readonly draftService: DraftService,
    protected readonly mapper: AccountMapper,
    protected readonly keycloakAdminService: KeycloakAdminService,
  ) {
    super(repository, draftService, mapper, { softDelete: false });

    AccountService.updateRepository(keycloakAdminService, repository);
  }

  async create(account: IAccountDto): Promise<void> {
    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      await super.create(account);

      const keycloakUser: UserRepresentation = {
        username: account.username,
        enabled: account.enabled,
        emailVerified: account.emailVerified,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        realmRoles: account.realmRoles,
        credentials: [{ value: account.password, type: 'password' }],
      };

      await this.keycloakAdminService.createAccount(keycloakUser);

      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw ExceptionHandler(err);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, account: IAccountDto): Promise<void> {
    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      await super.update(id, account, false);

      const keycloakUser: UserRepresentation = account;
      keycloakUser.credentials = [{ value: account.password, type: 'password' }];
      await this.keycloakAdminService.updateAccount(id, account);

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
      await this.keycloakAdminService.deleteUserById(id);

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
    repository: Repository<Account>,
  ): Promise<void> {
    const accounts = await keycloakAdminService.accountsList();
    const result = await repository.find();

    const differences = _.differenceBy(result, accounts, 'id');

    if (differences.length > 0) {
      differences.map(async dif => {
        await repository.delete(dif.id);
      });
    }

    await Promise.all(
      accounts.map(async account => {
        if (!!(await repository.findOne(account.id))) {
          return await repository.update(account.id, new Account(account));
        } else {
          return await repository.save(new Account(account));
        }
      }),
    );
  }
}
