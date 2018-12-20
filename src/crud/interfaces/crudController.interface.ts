import { Response } from 'express';
import { IFile } from '../../fileStorage/interfaces/fileStorage.interface';
import { ICrudDto } from './crud.interface';
import { IFormSchema } from './form.interface';

export interface ICrudController<TDto extends ICrudDto> {
  getFormSchema(id?: string): Promise<IFormSchema>;

  openDeleted(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }>;

  findAll(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }>;

  findAllDrafts(filterArg?: string): Promise<{ items: TDto[]; totalCount: number }>;

  fetchById(id: string): Promise<TDto>;

  fetchDeletedById(id: string): Promise<TDto>;

  fetchDraftById(id: string): Promise<TDto>;

  create(data: TDto): Promise<TDto>;

  saveAsDraft(data: TDto): Promise<object>;

  update(id: string, data: object): Promise<TDto>;

  destroy(id: string): Promise<boolean>;

  destroyDraft(id: string): Promise<boolean>;

  destroyBulk(param: {
    ids: string;
  }): Promise<{
    [name: string]: boolean;
  }>;

  importCSV(file: IFile): Promise<TDto[]>;

  exportCSV(res: Response, filterArg?: string): Promise<void>;

  downloadCSVTemplate(res: Response): Promise<void>;
}
