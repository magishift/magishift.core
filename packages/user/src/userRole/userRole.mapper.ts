import { CrudMapper } from '../../crud/crud.mapper';
import { ICrudMapper } from '../../crud/interfaces/crudMapper.Interface';
import { IUserRole, IUserRoleDto } from './interfaces/userRole.interface';

export abstract class UserRoleMapper<TEntity extends IUserRole, TDto extends IUserRoleDto>
  extends CrudMapper<TEntity, TDto>
  implements ICrudMapper<TEntity, TDto> {
  constructor(protected readonly IEntity: new () => TEntity, protected readonly IDto: new () => TDto) {
    super(IEntity, IDto);
  }
}
