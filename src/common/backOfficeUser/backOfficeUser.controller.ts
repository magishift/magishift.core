import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../auth/role/defaultRoles';
import { FileStorageService } from '../../fileStorage/fileStorage.service';
import { IUser, IUserDto } from '../../user/interfaces/user.interface';
import { UserControllerFactory } from '../../user/user.controller';
import { BackOfficeUserMapper } from './backOfficeUser.mapper';
import { BackOfficeUserService } from './backOfficeUser.service';
import { BO_USER_ENDPOINT } from './interfaces/backOfficeUser.const';

@Controller(BO_USER_ENDPOINT)
export class BackOfficeUserController extends UserControllerFactory<IUserDto, IUser>(BO_USER_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: BackOfficeUserService,
    protected readonly fileService: FileStorageService,
    protected readonly mapper: BackOfficeUserMapper,
  ) {
    super(service, fileService, mapper);
  }
}
