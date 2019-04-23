import {
  Body,
  ClassSerializerInterceptor,
  Controller,
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
import { ApiImplicitBody, ApiImplicitFile, ApiImplicitQuery, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Response } from 'express';
import { DefaultRoles } from '../auth/role/defaultRoles';
import { Realms } from '../auth/role/realms.decorator';
import { Roles } from '../auth/role/roles.decorator';
import { RolesGuard } from '../auth/role/roles.guard';
import { IFile } from '../fileStorage/interfaces/fileStorage.interface';
import { IEndpointUserRoles } from '../user/userRole/interfaces/userRoleEndpoint.interface';
import { CrudController } from './base/crud.controller.base';
import { Filter } from './crud.filter';
import { ICrudConfig, ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudController } from './interfaces/crudController.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudService } from './interfaces/crudService.interface';
import { IFindAllResult } from './interfaces/filter.interface';
import { IFormSchema } from './interfaces/form.interface';
import { SwaggerGridSchema } from './interfaces/grid.interface';

export function CrudControllerFactory<TDto extends ICrudDto, TEntity extends ICrudEntity>(
  name: string,
  dtoClass: new (...args: any[]) => TDto,
  roles: IEndpointUserRoles,
  realmsAccess?: string[],
): new (service: ICrudService<TEntity, TDto>, mapper: ICrudMapper<TEntity, TDto>) => CrudController<TDto, TEntity> {
  @Controller(name)
  @ApiUseTags(name)
  @UseGuards(RolesGuard)
  @Roles(...roles.default)
  @Realms(...(realmsAccess || []))
  @UseInterceptors(ClassSerializerInterceptor)
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
      return { schema: new dtoClass().formSchema };
    }

    @Get('/grid')
    @Roles(DefaultRoles.authenticated)
    @ApiResponse({ status: 200, type: SwaggerGridSchema })
    getGridSchema(): SwaggerGridSchema {
      return super.getGridSchema();
    }

    @Get('/deleted')
    @Roles(...(roles.read || roles.default))
    @ApiImplicitQuery({
      name: 'filter',
      description: 'example: {"order":["id DESC"],"where":{},"limit":25,"offset":0}',
      type: Filter,
    })
    async openDeleted(@Query('filter') filterArg?: string): Promise<IFindAllResult> {
      return await super.openDeleted(filterArg);
    }

    @Get('drafts')
    @Roles(...(roles.read || roles.default))
    @ApiImplicitQuery({
      name: 'filter',
      description: 'example: {"order":["id DESC"],"where":{},"limit":25,"offset":0}',
      type: Filter,
    })
    async findAllDrafts(@Query('filter') filterArg?: string): Promise<IFindAllResult> {
      return await super.findAllDrafts(filterArg);
    }

    @Get()
    @Roles(...(roles.read || roles.default))
    @ApiImplicitQuery({
      name: 'filter',
      description: 'example: {"order":["id DESC"],"where":{},"limit":25,"offset":0}',
    })
    async findAll(@Query('filter') filterArg?: string): Promise<IFindAllResult> {
      return await super.findAll(filterArg);
    }

    @Get(':id')
    @Roles(...(roles.read || roles.default))
    async fetchById(@Param('id') id: string): Promise<TDto> {
      return await super.fetchById(id);
    }

    @Get('deleted/:id')
    @Roles(...(roles.read || roles.default))
    async fetchDeletedById(@Param('id') id: string): Promise<TDto> {
      return await super.fetchDeletedById(id);
    }

    @Get('draft/:id')
    @Roles(...(roles.read || roles.default))
    async fetchDraftById(@Param('id') id: string): Promise<TDto> {
      return await super.fetchDraftById(id);
    }

    @Post()
    @Roles(...(roles.write || roles.default))
    @ApiImplicitBody({
      name: 'Create ' + name,
      type: dtoClass,
    })
    async create(@Body() data: TDto): Promise<TDto> {
      return await super.create(data);
    }

    @Post('draft')
    @Roles(...(roles.write || roles.default))
    @ApiImplicitBody({
      name: 'Create Draft ' + name,
      type: dtoClass,
    })
    async saveAsDraft(@Body() data: TDto): Promise<TDto> {
      return await super.saveAsDraft(data);
    }

    @Patch(':id')
    @Roles(...(roles.update || roles.write || roles.default))
    @ApiImplicitBody({
      name: 'Update ' + name,
      type: dtoClass,
    })
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
    async destroyBulk(@Param('ids') { ids }: { ids: string }): Promise<{
      [key: string]: string;
    }> {
      return await super.destroyBulk({ ids });
    }

    @Post('import-csv')
    @Roles(...(roles.write || roles.default))
    @ApiImplicitFile({ name: 'file' })
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
