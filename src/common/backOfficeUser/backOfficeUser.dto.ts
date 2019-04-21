import { InputType, ObjectType } from 'type-graphql';
import { Form } from '../../crud/form.decorator';
import { Grid } from '../../crud/grid.decorator';
import { IUserDto } from '../../user/interfaces/user.interface';
import { UserDto } from '../../user/user.dto';

@Grid()
@Form()
@ObjectType('BackOfficeUser')
@InputType()
export class BackOfficeUserDto extends UserDto implements IUserDto {}
