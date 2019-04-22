import { InputType, ObjectType } from 'type-graphql';
import { Form } from '../../../../../src/crud/form.decorator';
import { Grid } from '../../../../../src/crud/grid.decorator';
import { IUserRoleDto } from '../../../../../src/user/userRole/interfaces/userRole.interface';
import { UserRoleDto } from '../../../../../src/user/userRole/userRole.dto';
import { IVendorUserDto } from '../interfaces/vendorUser.interface';
import { VENDOR_ROLE_ENDPOINT } from './interfaces/vendorUserRole.const';

@Grid()
@Form()
@ObjectType(VENDOR_ROLE_ENDPOINT)
@InputType()
export class VendorUserRoleDto extends UserRoleDto implements IUserRoleDto {
  users: IVendorUserDto[];
}
