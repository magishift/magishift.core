import { AccountDto } from '../auth/account/account.dto';
import { AccountMapper } from '../auth/account/account.mapper';
import { CrudMapper } from '../crud/crud.mapper';
import { ICrudMapper } from '../crud/interfaces/crudMapper.Interface';
import { IUser, IUserDto } from './interfaces/user.interface';

export abstract class UserMapper<TEntity extends IUser, TDto extends IUserDto> extends CrudMapper<TEntity, TDto>
  implements ICrudMapper<TEntity, TDto> {
  constructor(
    protected readonly accountMapper: AccountMapper,
    protected readonly IEntity: new () => TEntity,
    protected readonly IDto: new () => TDto,
  ) {
    super(IEntity, IDto);
  }

  async entityToDto(entity: TEntity): Promise<TDto> {
    const dto = await super.entityToDto(entity);

    if (dto && dto.account) {
      dto.account.password = undefined;

      dto.accountId = dto.account.id;
      dto.isActive = dto.account.isActive;
      dto.username = dto.account.username;
      dto.password = dto.account.password;
      dto.passwordConfirm = dto.account.passwordConfirm;
      dto.realm = dto.account.realm;
    }

    return dto;
  }

  async dtoFromObject(obj: TDto): Promise<TDto> {
    const dto = await super.dtoFromObject(obj);

    const account = new AccountDto({
      id: obj.accountId,
      isActive: obj.isActive,
      username: obj.username,
      password: obj.password,
      passwordConfirm: obj.passwordConfirm,
      realm: dto.realm,
    });

    dto.account = await this.accountMapper.dtoFromObject(account);

    return dto;
  }
}
