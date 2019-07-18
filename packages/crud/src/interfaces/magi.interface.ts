import { DataMeta } from '../types/magi.type';

export interface IMagiEntity {
  id: string;
  alias?: string;
  isDeleted: boolean;
  __meta?: DataMeta;
}

export interface IMagiDto {
  id?: string;
  alias?: string;
  isDeleted: boolean;
  __meta?: DataMeta;
}
