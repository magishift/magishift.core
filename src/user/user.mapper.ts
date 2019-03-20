import { v4 as uuid } from 'uuid';
import { AccountDto } from '../auth/account/account.dto';
import { RoleDto } from '../auth/role/role.dto';
import { CrudMapper } from '../crud/crud.mapper';
import { ICrudMapper } from '../crud/interfaces/crudMapper.Interface';
import { IUser, IUserDto } from './interfaces/user.interface';

export abstract class UserMapper<TEntity extends IUser, TDto extends IUserDto> extends CrudMapper<TEntity, TDto>
  implements ICrudMapper<TEntity, TDto> {
  constructor(protected readonly IEntity: new () => TEntity, protected readonly IDto: new () => TDto) {
    super(IEntity, IDto);
  }

  async entityToDto(entity: TEntity): Promise<TDto> {
    const dto = await super.entityToDto(entity);

    if (dto && dto.account) {
      dto.accountId = dto.account.id;
      dto.username = dto.account.username;
      dto.roles = dto.account.realmRoles.map(role => {
        return new RoleDto({
          name: role,
        });
      });
    }

    return dto;
  }

  async dtoFromObject(obj: TDto): Promise<TDto> {
    const dto = await super.dtoFromObject(obj);

    const account = new AccountDto({
      id: obj.accountId || uuid(),
      username: obj.username,
      password: obj.password,
      passwordConfirm: obj.passwordConfirm,
      realmRoles: obj.roles.map(role => {
        return role.name;
      }),
      email: obj.email,
      firstName: obj.name,
      lastName: '',
    });

    dto.account = account;

    return dto;
  }
}
