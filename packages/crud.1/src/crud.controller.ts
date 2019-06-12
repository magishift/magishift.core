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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiImplicitBody,
  ApiImplicitFile,
  ApiImplicitQuery,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Filter } from './crud.filter';
import { CrudController } from './interfaces/crud.controller.base';
import { ICrudConfig, ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudController } from './interfaces/crudController.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudService } from './interfaces/crudService.interface';
import { IFile } from './interfaces/file.interface';
import { IFindAllResult } from './interfaces/filter.interface';
import { IFormSchema } from './interfaces/form.interface';
import { IGridSchema } from './interfaces/grid.interface';

export function CrudControllerFactory<TDto extends ICrudDto, TEntity extends ICrudEntity>(
  name: string,
  dtoClass: new (...args: any[]) => TDto,
): new (service: ICrudService<TEntity, TDto>, mapper: ICrudMapper<TEntity, TDto>) => CrudController<TDto, TEntity> {
  class FindAllResult extends IFindAllResult<TDto> {}

  @Controller(name)
  @ApiUseTags(name)
  @UseInterceptors(ClassSerializerInterceptor)
  class CrudControllerBuilder extends CrudController<TDto, TEntity> implements ICrudController<TDto> {
    constructor(
      protected readonly service: ICrudService<TEntity, TDto>,
      protected readonly mapper: ICrudMapper<TEntity, TDto>,
    ) {
      super(service, mapper);
    }

    @Get('/crudConfig')
    @ApiOperation({ title: `Get ${name} CRUD (form and grid schema included) config` })
    @ApiResponse({ status: 200, type: ICrudConfig })
    getCrudConfig(): ICrudConfig {
      return super.getCrudConfig();
    }

    @Get('/form')
    @ApiOperation({ title: `Get ${name} form schema config` })
    @ApiResponse({ status: 200, type: IFormSchema })
    getFormSchema(): IFormSchema {
      return { schema: new dtoClass().formSchema };
    }

    @Get('/grid')
    @ApiOperation({ title: `Get ${name} grid schema config` })
    @ApiResponse({ status: 200, type: IGridSchema })
    getGridSchema(): IGridSchema {
      return super.getGridSchema();
    }

    @Get()
    @ApiOperation({ title: `Fetch and filter list of ${name} ` })
    @ApiImplicitQuery({
      name: 'filter',
      description: 'example: {"order":["id DESC"],"where":{},"limit":25,"offset":0}',
      type: Filter,
      required: false,
    })
    @ApiResponse({ status: 200, type: FindAllResult })
    async findAll(@Query('filter') filterArg?: string): Promise<FindAllResult> {
      return await super.findAll(filterArg);
    }

    @Get(':id')
    @ApiOperation({ title: `Fetch single ${name} by id` })
    async fetchById(@Param('id') id: string): Promise<TDto> {
      return await super.fetchById(id);
    }

    @Get('deleted/:id')
    @ApiOperation({ title: `Get single deleted ${name} by id` })
    async fetchDeletedById(@Param('id') id: string): Promise<TDto> {
      return await super.fetchDeletedById(id);
    }

    @Get('/deleted')
    @ApiOperation({ title: `Get all deleted ${name}` })
    @ApiImplicitQuery({
      name: 'filter',
      description: 'example: {"order":["id DESC"],"where":{},"limit":25,"offset":0}',
      type: Filter,
      required: false,
    })
    async openDeleted(@Query('filter') filterArg?: string): Promise<FindAllResult> {
      return await super.openDeleted(filterArg);
    }

    @Post()
    @ApiImplicitBody({
      name: 'Create ' + name,
      type: dtoClass,
    })
    @ApiOperation({ title: `Create new ${name}` })
    async create(@Body() data: TDto): Promise<TDto> {
      return await super.create(data);
    }

    @Patch(':id')
    @ApiImplicitBody({
      name: 'Update ' + name,
      type: dtoClass,
    })
    @ApiOperation({ title: `Update existing ${name}` })
    async update(@Param('id') id: string, @Body() data: TDto): Promise<TDto> {
      return await super.update(id, data);
    }

    @Delete(':id')
    @ApiOperation({ title: `Delete existing ${name}` })
    async destroy(@Param('id') id: string): Promise<void> {
      return await super.destroy(id);
    }

    @Delete('multi/:ids')
    @ApiOperation({ title: `Delete multiple existing ${name}` })
    async destroyBulk(@Param('ids') { ids }: { ids: string }): Promise<{
      [key: string]: string;
    }> {
      return await super.destroyBulk({ ids });
    }

    @Post('import-csv')
    @ApiImplicitFile({ name: 'file' })
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ title: `Import and create ${name} from CSV file` })
    async importCSV(@UploadedFile() file: IFile): Promise<TDto[]> {
      return await super.importCSV(file);
    }

    @Get('export/csv')
    @ApiOperation({ title: `Export listed ${name} to CSV file` })
    async exportCSV(@Res() res: Response, @Query('filter') filterArg?: string): Promise<void> {
      return await super.exportCSV(res, filterArg);
    }

    @Get('import-csv/template')
    @ApiOperation({ title: `Download ${name}'s CSV template` })
    async downloadCSVTemplate(@Res() res: Response): Promise<void> {
      return await super.downloadCSVTemplate(res);
    }
  }

  return CrudControllerBuilder;
}
