import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';

export interface IRole extends ICrudEntity {
  name: string;
  description: string;
}

export interface IRoleDto extends ICrudDto {
  name: string;
  description: string;
}
