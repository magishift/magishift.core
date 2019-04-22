import { InputType, ObjectType } from 'type-graphql';
import { Form } from '../../../crud/form.decorator';
import { Grid } from '../../../crud/grid.decorator';
import { IUserDto } from '../../../user/interfaces/user.interface';
import { IUserRoleDto } from '../../../user/userRole/interfaces/userRole.interface';
import { UserRoleDto } from '../../../user/userRole/userRole.dto';
import { BO_ROLE_ENDPOINT } from './interfaces/backOfficeUser.const';

@Grid()
@Form()
@ObjectType(BO_ROLE_ENDPOINT)
@InputType()
export class BackOfficeRoleDto extends UserRoleDto implements IUserRoleDto {
  users: IUserDto[];
}
