import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiUseTags } from '@nestjs/swagger';
import { Response } from 'express';
import { DefaultRoles } from '../auth/role/defaultRoles';
import { Realms } from '../auth/role/realms.decorator';
import { Roles } from '../auth/role/roles.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { IFile } from '../fileStorage/interfaces/fileStorage.interface';
import { IEndpointUserRoles } from '../user/userRole/interfaces/userRoleEndpoint.interface';
import { CrudController } from './base/crud.controller.base';
import { ICrudConfig, ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudController } from './interfaces/crudController.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudService } from './interfaces/crudService.interface';
import { IFormSchema } from './interfaces/form.interface';
import { IGridSchema } from './interfaces/grid.interface';

export function CrudControllerFactory<TDto extends ICrudDto, TEntity extends ICrudEntity>(
  name: string,
  roles: IEndpointUserRoles,
  realms?: string[],
): new (service: ICrudService<TEntity, TDto>, mapper: ICrudMapper<TEntity, TDto>) => CrudController<TDto, TEntity> {
  @ApiUseTags(name)
  @UseGuards(RolesGuard)
  @Roles(...roles.default)
  @Realms(...(realms || []))
  class CrudControllerBuilder extends CrudController<TDto, TEntity> implements ICrudController<TDto> {
    constructor(
      protected readonly service: ICrudService<TEntity, TDto>,
      protected readonly mapper: ICrudMapper<TEntity, TDto>,
    ) {
      super(service, mapper);
    }

    @Get('/crudConfig')
    @Roles(DefaultRoles.authenticated)
    getConfig(): ICrudConfig {
      return super.getConfig();
    }

    @Get('/form')
    @Roles(DefaultRoles.authenticated)
    getFormSchema(): IFormSchema {
      return super.getFormSchema();
    }

    @Get('/grid')
    @Roles(DefaultRoles.authenticated)
    getGridSchema(): IGridSchema {
      return super.getGridSchema();
    }

    @Get('/deleted')
    @Roles(...(roles.read || roles.default))
    async openDeleted(@Query('filter') filterArg?: string): Promise<{ items: TDto[]; totalCount: number }> {
      return await super.openDeleted(filterArg);
    }

    @Get('drafts')
    @Roles(...(roles.read || roles.default))
    async findAllDrafts(@Query('filter') filterArg?: string): Promise<{ items: TDto[]; totalCount: number }> {
      return await super.findAllDrafts(filterArg);
    }

    @Get()
    @Roles(...(roles.read || roles.default))
    async findAll(@Query('filter') filterArg?: string): Promise<{ items: TDto[]; totalCount: number }> {
      return await super.findAll(filterArg);
    }

    @Get(':id')
    @Roles(...(roles.read || roles.default))
    async fetchById(@Param('id') id: string): Promise<TDto> {
      return await super.fetchById(id);
    }

    @Get('deleted/:id')
    @Roles(...(roles.read || roles.default))
    async fetchDeletedById(id: string): Promise<TDto> {
      return await super.fetchDeletedById(id);
    }

    @Get('draft/:id')
    @Roles(...(roles.read || roles.default))
    async fetchDraftById(id: string): Promise<TDto> {
      return await super.fetchDraftById(id);
    }

    @Post()
    @Roles(...(roles.write || roles.default))
    async create(@Body() data: TDto): Promise<TDto> {
      return await super.create(data);
    }

    @Post('draft')
    @Roles(...(roles.write || roles.default))
    async saveAsDraft(@Body() data: TDto): Promise<TDto> {
      return await super.saveAsDraft(data);
    }

    @Patch(':id')
    @Roles(...(roles.update || roles.write || roles.default))
    async update(@Param('id') id: string, @Body() data: TDto): Promise<TDto> {
      return await super.update(id, data);
    }

    @Delete(':id')
    @Roles(...(roles.delete || roles.default))
    async destroy(@Param('id') id: string): Promise<void> {
      return await super.destroy(id);
    }

    @Delete('draft/:id')
    @Roles(...(roles.delete || roles.default))
    async destroyDraft(@Param('id') id: string): Promise<void> {
      return await super.destroyDraft(id);
    }

    @Delete('multi/:ids')
    @Roles(...(roles.delete || roles.default))
    async destroyBulk(@Param() { ids }: { ids: string }): Promise<{
      [key: string]: string;
    }> {
      return await super.destroyBulk({ ids });
    }

    @Post('import-csv')
    @Roles(...(roles.write || roles.default))
    @UseInterceptors(FileInterceptor('file'))
    async importCSV(@UploadedFile() file: IFile): Promise<TDto[]> {
      return await super.importCSV(file);
    }

    @Get('export/csv')
    @Roles(...(roles.read || roles.default))
    async exportCSV(@Res() res: Response, @Query('filter') filterArg?: string): Promise<void> {
      return await super.exportCSV(res, filterArg);
    }

    @Get('import-csv/template')
    @Roles(...(roles.write || roles.default))
    async downloadCSVTemplate(@Res() res: Response): Promise<void> {
      return await super.downloadCSVTemplate(res);
    }
  }

  return CrudControllerBuilder;
}
