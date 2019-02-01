import { Controller } from '@nestjs/common';
import { DefaultRoles } from '../../auth/role/role.const';
import { FileStorageService } from '../../fileStorage/fileStorage.service';
import { UserControllerFactory } from '../../user/user.controller';
import { AdminMapper } from './admin.mapper';
import { AdminService } from './admin.service';
import { ADMIN_ENDPOINT } from './interfaces/admin.const';
import { IAdmin, IAdminDto } from './interfaces/admin.interface';

@Controller(ADMIN_ENDPOINT)
export class AdminController extends UserControllerFactory<IAdminDto, IAdmin>(ADMIN_ENDPOINT, {
  default: [DefaultRoles.superAdmin],
}) {
  constructor(
    protected readonly service: AdminService,
    protected readonly fileService: FileStorageService,
    protected readonly mapper: AdminMapper,
  ) {
    super(service, fileService, mapper);
  }
}
