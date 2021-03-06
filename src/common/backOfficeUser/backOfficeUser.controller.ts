import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../auth/role/defaultRoles';
import { FileStorageService } from '../../fileStorage/fileStorage.service';
import { IUser, IUserDto } from '../../user/interfaces/user.interface';
import { UserControllerFactory } from '../../user/user.controller';
import { BackOfficeUserDto } from './backOfficeUser.dto';
import { BackOfficeUserMapper } from './backOfficeUser.mapper';
import { BackOfficeUserService } from './backOfficeUser.service';
import { BO_USER_ENDPOINT, BO_USER_REALM } from './interfaces/backOfficeUser.const';

@Controller(BO_USER_ENDPOINT)
export class BackOfficeUserController extends UserControllerFactory<IUserDto, IUser>(
  BO_USER_ENDPOINT,
  BackOfficeUserDto,
  {
    default: [DefaultRoles.admin],
  },
  [BO_USER_REALM],
) {
  constructor(
    protected readonly service: BackOfficeUserService,
    protected readonly fileService: FileStorageService,
    protected readonly mapper: BackOfficeUserMapper,
  ) {
    super(service, fileService, mapper);
  }
}
