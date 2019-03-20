import { Response } from 'express';
import { IFile } from '../../fileStorage/interfaces/fileStorage.interface';
import { ICrudDto } from './crud.interface';
import { IFormSchema } from './form.interface';

export interface ICrudController<TDto extends ICrudDto> {
  getFormSchema(id: string, isDraft: string, isDeleted: string): Promise<IFormSchema>;

  getGridSchema(): object;

  openDeleted(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }>;

  findAll(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }>;

  findAllDrafts(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }>;

  fetchById(id: string): Promise<TDto>;

  fetchDeletedById(id: string): Promise<TDto>;

  fetchDraftById(id: string): Promise<TDto>;

  create(data: TDto): Promise<void>;

  saveAsDraft(data: TDto): Promise<object>;

  update(id: string, data: object): Promise<void>;

  destroy(id: string): Promise<void>;

  destroyDraft(id: string): Promise<void>;

  destroyBulk(param: {
    ids: string;
  }): Promise<{
    [key: string]: string;
  }>;

  importCSV(file: IFile): Promise<TDto[]>;

  exportCSV(res: Response, filterArg?: string): Promise<void>;

  downloadCSVTemplate(res: Response): Promise<void>;
}
