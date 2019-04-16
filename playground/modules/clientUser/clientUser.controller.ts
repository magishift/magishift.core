import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { FileStorageService } from '../../../src/fileStorage/fileStorage.service';
import { IUser, IUserDto } from '../../../src/user/interfaces/user.interface';
import { UserControllerFactory } from '../../../src/user/user.controller';
import { ClientUserDto } from './clientUser.dto';
import { ClientUserMapper } from './clientUser.mapper';
import { ClientUserService } from './clientUser.service';
import { CLIENT_USER_ENDPOINT } from './interfaces/clientUser.const';

@Controller(CLIENT_USER_ENDPOINT)
export class ClientUserController extends UserControllerFactory<IUserDto, IUser>(CLIENT_USER_ENDPOINT, ClientUserDto, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: ClientUserService,
    protected readonly fileService: FileStorageService,
    protected readonly mapper: ClientUserMapper,
  ) {
    super(service, fileService, mapper);
  }
}
