import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../auth/role/role.const';
import { FileStorageService } from '../../fileStorage/fileStorage.service';
import { IUser, IUserDto } from '../../user/interfaces/user.interface';
import { UserControllerFactory } from '../../user/user.controller';
import { AdminMapper } from './admin.mapper';
import { AdminService } from './admin.service';
import { ADMIN_ENDPOINT } from './interfaces/admin.const';

@Controller(ADMIN_ENDPOINT)
export class AdminController extends UserControllerFactory<IUserDto, IUser>(ADMIN_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: AdminService,
    protected readonly fileService: FileStorageService,
    protected readonly mapper: AdminMapper,
  ) {
    super(service, fileService, mapper);
  }
}
