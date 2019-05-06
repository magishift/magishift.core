import { ValidationError } from 'class-validator';

export enum DataStatus {
  Draft = 'draft',
  Submitted = 'submitted',
}

export interface IBaseEntity {
  id: string;
}

export interface IBaseDto {
  id: string;

  validate(): Promise<ValidationError[]>;
}

export interface ILocation {
  id: string;
  lng: number;
  lat: number;
}
