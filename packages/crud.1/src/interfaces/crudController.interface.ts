import { Response } from 'express';
import { ICrudConfig, ICrudDto } from './crud.interface';
import { IFile } from './file.interface';
import { IFormSchema } from './form.interface';
import { IGridSchema } from './grid.interface';

export interface ICrudController<TDto extends ICrudDto> {
  getCrudConfig(): ICrudConfig;

  getFormSchema(): IFormSchema;

  getGridSchema(): IGridSchema;

  openDeleted(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }>;

  findAll(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }>;

  fetchById(id: string): Promise<TDto>;

  fetchDeletedById(id: string): Promise<TDto>;

  create(data: TDto): Promise<TDto>;

  update(id: string, data: object): Promise<TDto>;

  destroy(id: string): Promise<void>;

  destroyBulk(param: {
    ids: string;
  }): Promise<{
    [key: string]: string;
  }>;

  importCSV(file: IFile): Promise<TDto[]>;

  exportCSV(res: Response, filterArg?: string): Promise<void>;

  downloadCSVTemplate(res: Response): Promise<void>;
}
