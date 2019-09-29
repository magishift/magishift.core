import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccountService } from '../auth/account/account.service';
import { ILoginData, ITokenUser } from '../auth/interfaces/auth.interface';
import { CrudMapper } from '../crud/crud.mapper';
import { CrudService } from '../crud/crud.service';
import { DraftService } from '../crud/draft/draft.service';
import { IUser, IUserDto } from './interfaces/user.interface';

export abstract class UserService<TEntity extends IUser, TDto extends IUserDto> extends CrudService<TEntity, TDto> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly accountService: AccountService,
    protected readonly draftService: DraftService,
    protected readonly mapper: CrudMapper<TEntity, TDto>,
  ) {
    super(repository, draftService, mapper);
  }

  async create(data: TDto): Promise<TDto> {
    await data.validate();

    if (data.account && data.account.password && data.account.username) {
      const account = await this.accountService.create(data.account);
      data.account = account;
    }

    const userDto = await this.mapper.dtoToEntity(data);
    const userEntity = await this.repository.save(userDto);

    if (await this.draftService.isExist(data.id)) {
      this.draftService.delete(data.id);
    }

    return this.mapper.entityToDto(userEntity);
  }

  async update(id: string, data: TDto): Promise<TDto> {
    await data.validate();

    if (data.account && data.account.password && data.account.username) {
      await this.accountService.update(data.account.id, data.account);
    }

    const userDto = await this.mapper.dtoToEntity(data);

    await this.repository.update(id, userDto as any);

    return this.fetch(id);
  }

  async destroy(id: string): Promise<boolean> {
    const user = await this.findOne({ id } as any);

    await this.accountService.destroy(user.account.id);
    await super.destroy(id);

    return true;
  }

  async changePassword(userId: string, newPass: string, confirmNewPass: string): Promise<boolean> {
    const userData: TDto = await super.fetch(userId);

    await this.accountService.changePassword(userData.account, newPass, confirmNewPass);

    return true;
  }

  async login(loginData: ILoginData): Promise<ITokenUser> {
    const account = await this.accountService.login(loginData);

    const userData = await super.findOne({ account } as any);

    if (!userData) {
      throw new HttpException('Account is not allowed to login from this service', 403);
    }

    const token = await this.accountService.createNewSession(account, userData);

    return {
      ...token,
      userData,
      accountId: account.id,
    };
  }

  async logout(token: string): Promise<void> {
    return this.accountService.logout(token);
  }
}
