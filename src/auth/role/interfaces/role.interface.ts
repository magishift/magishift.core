import { ICrudDto, ICrudEntity } from '../../../crud/interfaces/crud.interface';

export interface IRole extends ICrudEntity {
  title: string;
}

export interface IRoleDto extends ICrudDto {
  title: string;
}
