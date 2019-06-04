import { csvtojson, ExceptionHandler } from '@magishift/util';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { parse as json2csv } from 'json2csv';
import _ = require('lodash');
import * as stream from 'stream';
import { v4 as uuid } from 'uuid';
import { Filter } from '../crud.filter';
import { ICrudConfig, ICrudDto, ICrudEntity } from './crud.interface';
import { ICrudController } from './crudController.interface';
import { ICrudMapper } from './crudMapper.Interface';
import { ICrudService } from './crudService.interface';
import { IFile } from './file.interface';
import { IFindAllResult } from './filter.interface';
import { FieldTypes, IFormSchema } from './form.interface';
import { IGridSchema } from './grid.interface';

export abstract class CrudController<TDto extends ICrudDto, TEntity extends ICrudEntity>
  implements ICrudController<TDto> {
  constructor(
    protected readonly service: ICrudService<TEntity, TDto>,
    protected readonly mapper: ICrudMapper<TEntity, TDto>,
  ) {}

  getConfig(): ICrudConfig {
    try {
      return this.service.getCrudConfig();
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  getFormSchema(): IFormSchema {
    try {
      return this.service.getFormSchema();
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  getGridSchema(): IGridSchema {
    try {
      return this.service.getGridSchema();
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async openDeleted(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }> {
    try {
      let filter: Filter<TDto>;

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
      let filter: Filter<TDto>;

      if (filterArg) {
        filter = JSON.parse(filterArg);
      }

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

  async findAll(filterArg?: string): Promise<IFindAllResult> {
    try {
      let filter: Filter<TDto>;

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

  async create(data: TDto): Promise<TDto> {
    try {
      const param = await this.mapper.dtoFromObject(data);
      return await this.service.create(param);
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

  async update(id: string, data: TDto): Promise<TDto> {
    try {
      const param: TDto = await this.mapper.dtoFromObject(data);
      return await this.service.update(id, param);
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

      return ExceptionHandler('Invalid or empty CSV file', 400);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  async exportCSV(res: Response, filterArg?: string): Promise<void> {
    try {
      let filter: Filter<TDto>;

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

    _.forEach(formSchema.schema.fields, (value, key) => {
      const field = value;

      if (
        [FieldTypes.Map, FieldTypes.File, FieldTypes.CSV, FieldTypes.Image, FieldTypes.Table].indexOf(field.type) < 0
      ) {
        headers.push(key);
      }
    });

    return headers;
  }
}
