import { InputType, ObjectType } from 'type-graphql';
import { Form } from '../../../../src/crud/form.decorator';
import { Grid } from '../../../../src/crud/grid.decorator';
import { IUserDto } from '../../../../src/user/interfaces/user.interface';
import { IUserRoleDto } from '../../../../src/user/userRole/interfaces/userRole.interface';
import { UserRoleDto } from '../../../../src/user/userRole/userRole.dto';
import { CLIENT_ROLE_ENDPOINT } from './interfaces/clientUser.const';

@Grid()
@Form()
@ObjectType(CLIENT_ROLE_ENDPOINT)
@InputType()
export class ClientUserRoleDto extends UserRoleDto implements IUserRoleDto {
  users: IUserDto[];
}
