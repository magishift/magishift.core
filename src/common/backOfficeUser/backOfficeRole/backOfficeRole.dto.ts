import { Field, InputType, ObjectType } from 'type-graphql';
import { Form } from '../../../crud/form.decorator';
import { Grid } from '../../../crud/grid.decorator';
import { IUserDto } from '../../../user/interfaces/user.interface';
import { IUserRoleDto } from '../../../user/userRole/interfaces/userRole.interface';
import { UserRoleDto } from '../../../user/userRole/userRole.dto';
import { BackOfficeUserDto } from '../backOfficeUser.dto';

@Grid()
@Form()
@ObjectType('BackOfficeRole')
@InputType()
export class BackOfficeRoleDto extends UserRoleDto implements IUserRoleDto {
  @Field(() => [BackOfficeUserDto], { nullable: true })
  users: IUserDto[];
}
