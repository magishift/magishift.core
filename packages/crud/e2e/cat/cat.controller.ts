import { Controller, Get, Query, Param, Post, UsePipes, Body, Patch, Delete } from '@nestjs/common';
import { CatMapper } from './cat.mapper';
import { CatService } from './cat.service';
import { ApiOperation, ApiResponse, ApiImplicitBody, ApiImplicitParam } from '@nestjs/swagger';
import { FilterTransformerPipe, DtoTransformerPipe, IDeleteBulkResult } from '../../src';
import { ExceptionHandler } from '@magishift/util';
import { CatDto } from './cat.dto';
import { Cat } from './cat.entity';
import { FindAll } from './types/findAll';
import { Filter } from './types/filter';

@Controller('cat')
export class CatController {
  constructor(protected readonly service: CatService, protected readonly mapper: CatMapper) {}

  @Get()
  @ApiOperation({ title: `Fetch and filter list of test ` })
  @ApiResponse({ status: 200, type: FindAll })
  async findAll(@Query(new FilterTransformerPipe(Filter)) filterArg?: Filter): Promise<FindAll> {
    try {
      const items = await this.service.findAll(filterArg);

      const totalRecords = await this.service.count(filterArg);

      return {
        items,
        totalRecords,
      };
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Get('/deleted')
  @ApiOperation({ title: `Get all deleted test` })
  async openDeleted(@Query(new FilterTransformerPipe(Filter)) filterArg?: Filter): Promise<FindAll> {
    try {
      filterArg.isShowDeleted = true;

      const items = await this.service.findAll(filterArg);

      const totalRecords = await this.service.count(filterArg);

      return {
        items,
        totalRecords,
      };
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Get(':id')
  @ApiOperation({ title: `Fetch single test by id` })
  async fetchById(@Param('id') id: string): Promise<CatDto> {
    try {
      return this.service.fetch(id);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Get('deleted/:id')
  @ApiOperation({ title: `Get single deleted test by id` })
  async fetchDeletedById(@Param('id') id: string): Promise<CatDto> {
    try {
      return this.service.findOne({ id, isDeleted: true } as any);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Post()
  @ApiImplicitBody({
    name: 'Create Test',
    type: CatDto,
  })
  @ApiOperation({ title: `Create new test` })
  @UsePipes(new DtoTransformerPipe(Cat, CatDto))
  async create(@Body() data: CatDto): Promise<CatDto> {
    try {
      return await this.service.create(data);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Patch(':id')
  @ApiImplicitBody({
    name: 'Update test',
    type: CatDto,
  })
  @ApiOperation({ title: `Update existing test` })
  @UsePipes(new DtoTransformerPipe(Cat, CatDto))
  async update(@Param('id') id: string, @Body() data: CatDto): Promise<CatDto> {
    try {
      return await this.service.update(id, data);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Delete(':id')
  @ApiOperation({ title: `Delete existing test` })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.service.delete(id);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Delete('multi/:ids')
  @ApiOperation({ title: `Delete multiple existing test` })
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
  @ApiOperation({ title: `Purge existing test` })
  async destroy(@Param('id') id: string): Promise<void> {
    try {
      await this.service.delete(id);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Delete('multi/purge/:ids')
  @ApiOperation({ title: `Purge multiple existing test` })
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
