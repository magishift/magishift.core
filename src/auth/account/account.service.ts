import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../crud/crud.service';
import { DraftService } from '../../crud/draft/draft.service';
import { IUserDto } from '../../user/interfaces/user.interface';
import { AuthService } from '../auth.service';
import { ILoginData, IToken } from '../interfaces/auth.interface';
import { Account } from './account.entity';
import { AccountMapper } from './account.mapper';
import { IAccount, IAccountDto } from './interfaces/account.interface';

@Injectable()
export class AccountService extends CrudService<IAccount, IAccountDto> {
  constructor(
    @InjectRepository(Account) protected readonly repository: Repository<IAccount>,
    protected readonly authService: AuthService,
    protected readonly draftService: DraftService,
    protected readonly mapper: AccountMapper,
  ) {
    super(repository, draftService, mapper);
  }

  async create(data: IAccountDto): Promise<IAccountDto> {
    await data.validate();

    data.password = await this.authService.encryptPassword(data.password);

    return super.create(data, false);
  }

  async update(id: string, account: IAccountDto): Promise<IAccountDto> {
    if (account.password && account.passwordConfirm) {
      const password = await this.authService.validateNewPassword(account.password, account.passwordConfirm);

      account.password = password;
    } else {
      delete account.password;
    }

    await super.update(id, account, false);

    return this.fetch(id);
  }

  async changePassword(account: IAccountDto, newPass: string, confirmNewPass: string): Promise<boolean> {
    const password = await this.authService.validateNewPassword(newPass, confirmNewPass);

    await this.repository.update(account.id, {
      password,
    });

    return true;
  }

  async login(loginData: ILoginData): Promise<IAccountDto> {
    const account = await this.repository.findOne({
      where: { username: loginData.username },
    });

    if (!account) {
      throw new HttpException('Provided username is not registered', 401);
    }

    const isPasswordValid = await this.authService.comparePassword(loginData.password, account.password);

    if (isPasswordValid) {
      return this.mapper.entityToDto(account);
    } else {
      throw new HttpException('Invalid username or password', 401);
    }
  }

  async logout(token: string): Promise<void> {
    return this.authService.logout(token);
  }

  async createNewSession(account: IAccountDto, user: IUserDto): Promise<IToken> {
    return this.authService.createNewSession(account, user);
  }
}
