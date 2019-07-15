import { ExceptionHandler } from '@magishift/util';
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
  UseInterceptors,
} from '@nestjs/common';
import { ApiImplicitBody, ApiImplicitParam, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Filter } from './crud.filter';
import { ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudController } from './interfaces/crudController.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudService, IDeleteBulkResult } from './interfaces/crudService.interface';
import { IFindAllResult } from './interfaces/filter.interface';

export function CrudControllerFactory<TDto extends ICrudDto, TEntity extends ICrudEntity>(
  name: string,
  dtoClass: new (...args: any[]) => TDto,
): new (service: ICrudService<TEntity, TDto>, mapper: ICrudMapper<TEntity, TDto>) => ICrudController<TDto> {
  class FindAllResult extends IFindAllResult<TDto> {}

  @Controller(name)
  @ApiUseTags(name)
  @UseInterceptors(ClassSerializerInterceptor)
  class CrudControllerBuilder implements ICrudController<TDto> {
    constructor(
      protected readonly service: ICrudService<TEntity, TDto>,
      protected readonly mapper: ICrudMapper<TEntity, TDto>,
    ) {}

    @Get()
    @ApiOperation({ title: `Fetch and filter list of ${name} ` })
    @ApiResponse({ status: 200, type: FindAllResult })
    async findAll(@Query() filterArg?: Filter<TDto>): Promise<FindAllResult> {
      try {
        const items = await this.service.findAll(filterArg);
        const totalCount = await this.service.count(filterArg);

        return {
          items,
          totalCount,
        };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Get(':id')
    @ApiOperation({ title: `Fetch single ${name} by id` })
    async fetchById(@Param('id') id: string): Promise<TDto> {
      try {
        return this.service.fetch(id);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Get('deleted/:id')
    @ApiOperation({ title: `Get single deleted ${name} by id` })
    async fetchDeletedById(@Param('id') id: string): Promise<TDto> {
      try {
        return this.service.findOne({ id, isDeleted: true } as any);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Get('/deleted')
    @ApiOperation({ title: `Get all deleted ${name}` })
    async openDeleted(@Query('filter') filterArg?: Filter<TDto>): Promise<FindAllResult> {
      try {
        filterArg.isShowDeleted = true;

        const items = await this.service.findAll(filterArg);

        const totalCount = await this.service.count(filterArg);

        return {
          items,
          totalCount,
        };
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Post()
    @ApiImplicitBody({
      name: 'Create ' + name,
      type: dtoClass,
    })
    @ApiOperation({ title: `Create new ${name}` })
    async create(@Body() data: TDto): Promise<TDto> {
      try {
        const param = await this.mapper.dtoFromObject(data);
        return await this.service.create(param);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Patch(':id')
    @ApiImplicitBody({
      name: 'Update ' + name,
      type: dtoClass,
    })
    @ApiOperation({ title: `Update existing ${name}` })
    async update(@Param('id') id: string, @Body() data: TDto): Promise<TDto> {
      try {
        const param: TDto = await this.mapper.dtoFromObject(data);
        return await this.service.update(id, param);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Delete(':id')
    @ApiOperation({ title: `Delete existing ${name}` })
    async delete(@Param('id') id: string): Promise<void> {
      try {
        await this.service.delete(id);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Delete('multi/:ids')
    @ApiOperation({ title: `Delete multiple existing ${name}` })
    @ApiImplicitParam({
      name: 'ids',
      description: 'example: id,id,id',
      type: String,
      required: false,
    })
    async deleteBulk(@Param('ids') ids: string): Promise<IDeleteBulkResult[]> {
      try {
        const arrIds = ids.split(',');
        const result = await this.service.deleteBulk(arrIds);
        return result;
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Delete('purge/:id')
    @ApiOperation({ title: `Purge existing ${name}` })
    async destroy(@Param('id') id: string): Promise<void> {
      try {
        await this.service.delete(id);
      } catch (e) {
        return ExceptionHandler(e);
      }
    }

    @Delete('multi/purge/:ids')
    @ApiOperation({ title: `Purge multiple existing ${name}` })
    @ApiImplicitParam({
      name: 'ids',
      description: 'example: id,id,id',
      type: String,
      required: false,
    })
    async destroyBulk(@Param('ids') ids: string): Promise<IDeleteBulkResult[]> {
      try {
        const arrIds = ids.split(',');
        const result = await this.service.deleteBulk(arrIds);
        return result;
      } catch (e) {
        return ExceptionHandler(e);
      }
    }
  }

  return CrudControllerBuilder;
}
