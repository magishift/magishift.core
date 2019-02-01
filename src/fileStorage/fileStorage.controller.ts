import { Controller, Get, HttpException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DefaultRoles } from '../auth/role/role.const';
import { Roles } from '../auth/role/roles.decorator';
import { SessionUtil } from '../auth/session.util';
import { CrudControllerFactory } from '../crud/crud.controller';
import { FileStorageMapper } from './fileStorage.mapper';
import { FileStorageService } from './fileStorage.service';
import { FILE_STORAGE_ENDPOINT } from './interfaces/fileStorage.const';
import { IFileStorage, IFileStorageDto } from './interfaces/fileStorage.interface';

@Controller(FILE_STORAGE_ENDPOINT)
export class FileStorageController extends CrudControllerFactory<IFileStorageDto, IFileStorage>(FILE_STORAGE_ENDPOINT, {
  default: [DefaultRoles.admin],
}) {
  constructor(protected readonly service: FileStorageService, protected readonly mapper: FileStorageMapper) {
    super(service, mapper);
  }

  @Get('openFile/:id')
  @Roles(DefaultRoles.public)
  async fileFindById(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const file = await this.service.fetch(id);

    if (!file.permissions.some(permission => SessionUtil.getUserRoles.indexOf(permission) >= 0)) {
      throw new HttpException(`You don't have access for this file`, 403);
    }

    if (file.storage === 'S3') {
      const s3 = await this.service.openFileS3(file.url);
      return res.end(s3.Body);
    } else {
      return res.sendFile(file.url, { root: process.cwd() });
    }
  }
}
