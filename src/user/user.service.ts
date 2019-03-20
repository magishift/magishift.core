import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccountService } from '../auth/account/account.service';
import { AuthService } from '../auth/auth.service';
import { ILoginData } from '../auth/interfaces/auth.interface';
import { CrudMapper } from '../crud/crud.mapper';
import { CrudService } from '../crud/crud.service';
import { DraftService } from '../crud/draft/draft.service';
import { ICrudService } from '../crud/interfaces/crudService.interface';
import { ExceptionHandler } from '../utils/error.utils';
import { IUser, IUserDto } from './interfaces/user.interface';

export abstract class UserService<TEntity extends IUser, TDto extends IUserDto> extends CrudService<TEntity, TDto>
  implements ICrudService<TEntity, TDto> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly accountService: AccountService,
    protected readonly authService: AuthService,
    protected readonly draftService: DraftService,
    protected readonly mapper: CrudMapper<TEntity, TDto>,
  ) {
    super(repository, draftService, mapper);
  }

  async create(data: TDto): Promise<void> {
    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      await this.accountService.create(data.account);
      await super.create(data);

      if (await this.draftService.isExist(data.id)) {
        this.draftService.delete(data.id);
      }

      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw ExceptionHandler(err);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, data: TDto): Promise<void> {
    // get a repository query runner
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      await super.update(id, data);
      await this.accountService.update(data.account.id, data.account);

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
      const user = await this.findOne({ id } as any);
      await super.destroy(id);

      await this.accountService.destroy(user.account.id);

      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw ExceptionHandler(err);
    } finally {
      await queryRunner.release();
    }
  }

  async changePassword(_userId: string, _newPass: string, _confirmNewPass: string): Promise<boolean> {
    // const userData: TDto = await super.fetch(userId);

    // await this.authService.changePassword(userData.account, newPass, confirmNewPass);

    return true;
  }

  async login(loginData: ILoginData): Promise<any> {
    const grant = this.authService.login(loginData.password, loginData.username);

    const userData = await super.findOne({ account: grant } as any);

    if (!userData) {
      throw new HttpException('Account is not allowed to login from this service', 403);
    }

    return grant;
  }

  async logout(token: string): Promise<void> {
    return this.authService.logout(token);
  }
}
