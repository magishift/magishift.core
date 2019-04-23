import { CrudMapper } from '../crud/crud.mapper';
import { ICrudMapper } from '../crud/interfaces/crudMapper.Interface';
import { IUser, IUserDto } from './interfaces/user.interface';

export abstract class UserMapper<TEntity extends IUser, TDto extends IUserDto> extends CrudMapper<TEntity, TDto>
  implements ICrudMapper<TEntity, TDto> {
  constructor(protected readonly IEntity: new () => TEntity, protected readonly IDto: new () => TDto) {
    super(IEntity, IDto);
  }
}
