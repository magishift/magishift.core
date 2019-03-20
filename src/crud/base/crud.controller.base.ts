import { HttpException, Res } from '@nestjs/common';
import { Response } from 'express';
import { parse as json2csv } from 'json2csv';
import _ = require('lodash');
import * as stream from 'stream';
import { v4 as uuid } from 'uuid';
import { IFile } from '../../fileStorage/interfaces/fileStorage.interface';
import { csvtojson } from '../../utils/csvtojson';
import { ExceptionHandler } from '../../utils/error.utils';
import { ICrudDto, ICrudEntity } from '../interfaces/crud.interface';
import { ICrudController } from '../interfaces/crudController.interface';
import { ICrudMapper } from '../interfaces/crudMapper.Interface';
import { ICrudService } from '../interfaces/crudService.interface';
import { IFilter } from '../interfaces/filter.interface';
import { FieldTypes, IFormSchema } from '../interfaces/form.interface';

export abstract class CrudController<TDto extends ICrudDto, TEntity extends ICrudEntity>
  implements ICrudController<TDto> {
  constructor(
    protected readonly service: ICrudService<TEntity, TDto>,
    protected readonly mapper: ICrudMapper<TEntity, TDto>,
  ) {}

  async getFormSchema(id?: string, isDraft?: string, isDeleted?: string): Promise<IFormSchema> {
    try {
      return this.service.getFormSchema(id, isDraft, isDeleted);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  getGridSchema(): object {
    try {
      return this.service.getGridSchema();
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async openDeleted(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }> {
    try {
      let filter: IFilter;

      if (filterArg) {
        filter = JSON.parse(filterArg);
      }

      filter.isShowDeleted = true;

      const items = await this.service.findAll(filter);

      const totalCount = await this.service.count(filter);

      return {
        items,
        totalCount,
      };
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async findAllDrafts(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }> {
    try {
      let filter: IFilter;

      if (filterArg) {
        filter = JSON.parse(filterArg);
      }

      filter.isShowDraft = true;

      const items = await this.service.findAllDrafts(filter);

      const totalCount = 0;

      return {
        items,
        totalCount,
      };
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async findAll(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }> {
    try {
      let filter: IFilter;

      if (filterArg) {
        filter = JSON.parse(filterArg);
      }

      const items = await this.service.findAll(filter);
      const totalCount = await this.service.count(filter);

      return {
        items,
        totalCount,
      };
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async fetchById(id: string): Promise<TDto> {
    try {
      return this.service.fetch(id);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async fetchDeletedById(id: string): Promise<TDto> {
    try {
      return this.service.findOne({ id, isDeleted: true } as any);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async fetchDraftById(id: string): Promise<TDto> {
    try {
      return this.service.fetchDraft(id);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async create(data: TDto): Promise<void> {
    try {
      const param = await this.mapper.dtoFromObject(data);
      await this.service.create(param);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async saveAsDraft(data: TDto): Promise<TDto> {
    try {
      const param = await this.mapper.dtoFromObject(data);
      const result = await this.service.saveAsDraft(param);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async update(id: string, data: TDto): Promise<void> {
    try {
      const param: TDto = await this.mapper.dtoFromObject(data);
      await this.service.update(id, param);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async destroy(id: string): Promise<void> {
    try {
      await this.service.destroy(id);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async destroyDraft(id: string): Promise<void> {
    try {
      await this.service.destroyDraft(id);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async destroyBulk({ ids }: { ids: string }): Promise<{ [key: string]: string }> {
    try {
      const result = await this.service.destroyBulk(JSON.parse(ids));
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async importCSV(csvFile: IFile): Promise<TDto[]> {
    try {
      const csvObjects: TDto[] = await csvtojson(csvFile.buffer);

      if (csvObjects) {
        const importResults = await Promise.all(
          csvObjects.map(
            async (val): Promise<TDto> => {
              const param: TDto = await this.mapper.dtoFromObject(val);
              param.id = uuid();
              const result = await this.service.saveAsDraft(param);

              return result;
            },
          ),
        );

        return importResults;
      }

      throw new HttpException('Invalid or empty CSV file', 400);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async exportCSV(res: Response, filterArg?: string): Promise<void> {
    try {
      let filter: IFilter;

      if (filterArg) {
        filter = JSON.parse(filterArg);
      }

      const items = await this.service.findAll(filter);

      const headers = this.resolveCsvHeader();

      const csv = json2csv(items, headers);

      const readStream = new stream.PassThrough();
      readStream.end(csv);

      const humanName = this.constructor.name.replace('Controller', '');

      res.set(
        'Content-disposition',
        `attachment; filename=${humanName.toLowerCase()}-csv-exported-${Date().toString()}.csv`,
      );

      res.set('Content-Type', 'application/csv');

      readStream.pipe(res);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async downloadCSVTemplate(@Res() res: Response): Promise<void> {
    try {
      const headers = await this.resolveCsvHeader();

      const bufferSchema = Buffer.from(_.join(headers, ';'));

      const readStream = new stream.PassThrough();
      readStream.end(bufferSchema);

      const humanName = this.constructor.name.replace('Controller', '');

      res.set('Content-disposition', `attachment; filename=${humanName.toLowerCase()}-csv-template.csv`);

      res.set('Content-Type', 'application/csv');

      readStream.pipe(res);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  private async resolveCsvHeader(): Promise<string[]> {
    const formSchema = await this.service.getFormSchema();

    const headers = [];

    Object.keys(formSchema.schema.fields).map(key => {
      const field = formSchema.schema.fields[key];
      if (
        [FieldTypes.Map, FieldTypes.File, FieldTypes.CSV, FieldTypes.Image, FieldTypes.Table].indexOf(field.type) < 0
      ) {
        headers.push(key);
      }
    });

    return headers;
  }
}
