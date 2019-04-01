import { ICrudController } from '../../../crud/interfaces/crudController.interface';
import { IUserRoleDto } from './userRole.interface';

export interface IUserRoleController<TDto extends IUserRoleDto> extends ICrudController<TDto> {}
