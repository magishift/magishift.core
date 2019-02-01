import { CrudDto } from '../../crud/crud.dto';
import { IRoleDto } from './interfaces/role.interface';

export class RoleDto extends CrudDto implements IRoleDto {
  title: string;
}
