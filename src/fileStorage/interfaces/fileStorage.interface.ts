import { ICrudDto, ICrudEntity } from '../../crud/interfaces/crud.interface';

export interface IFile {
  buffer: Buffer;
  encoding: string;
  fieldname: string;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface IFileStorage extends ICrudEntity {
  ownerId: string;
  object: string;
  type: string;
  url: string;
  meta: IFile;
  permissions: string[];
  storage: 'local' | 'S3';
  dataStatus: 'temp' | 'submitted';
}

export interface IFileStorageDto extends ICrudDto {
  ownerId: string;
  object: string;
  type: string;
  file: IFile;
  url: string;
  meta: object;
  permissions: string[];
  storage: 'local' | 'S3';
  dataStatus: 'temp' | 'submitted';
}
