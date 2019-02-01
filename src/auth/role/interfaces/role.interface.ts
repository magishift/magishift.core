import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';

export interface IRole extends ICrudEntity {
  title: string;
  description: string;
}

export interface IRoleDto extends ICrudDto {
  title: string;
  description: string;
}
