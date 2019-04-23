import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DefaultRoles } from '../../../src/auth/role/defaultRoles';
import { CrudControllerFactory } from '../../../src/crud/crud.controller';
import { FileStorageDto } from '../../../src/fileStorage/fileStorage.dto';
import { FileStorageService } from '../../../src/fileStorage/fileStorage.service';
import { IFileStorageDto } from '../../../src/fileStorage/interfaces/fileStorage.interface';
import { ExceptionHandler } from '../../../src/utils/error.utils';
import { TENANT_ENDPOINT } from './interfaces/tenant.const';
import { ITenant, ITenantDto } from './interfaces/tenant.interface';
import { TenantDto } from './tenant.dto';
import { TenantMapper } from './tenant.mapper';
import { TenantService } from './tenant.service';

@Controller(TENANT_ENDPOINT)
export class TenantController extends CrudControllerFactory<ITenantDto, ITenant>(TENANT_ENDPOINT, TenantDto, {
  default: [DefaultRoles.admin],
}) {
  constructor(
    protected readonly service: TenantService,
    protected readonly fileService: FileStorageService,
    protected readonly mapper: TenantMapper,
  ) {
    super(service, mapper);
  }

  @Post('logo')
  @UseInterceptors(FileInterceptor('file'))
  async photo(@UploadedFile() file: any, @Body() { ownerId }: { ownerId: string }): Promise<IFileStorageDto> {
    try {
      const data = new FileStorageDto();
      const user = await this.service.findOne({ id: ownerId });

      if (user && user.logo) {
        data.id = user.logo.id;
      }

      data.file = file;
      data.ownerId = ownerId;
      data.object = 'tenant';
      data.type = 'logo';

      const uploadResult = await this.fileService.upload(data, DefaultRoles.authenticated);

      if (user) {
        user.logo = uploadResult;
        await this.service.update(ownerId, user);
      }

      return uploadResult;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
