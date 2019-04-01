import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';

export interface IUserRole extends ICrudEntity {
  id: string;
  name: string;
  description: string;
}

export interface IUserRoleDto extends ICrudDto {
  id: string;
  name: string;
  description: string;
}
