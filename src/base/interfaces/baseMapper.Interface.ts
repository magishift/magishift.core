import { DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseMapper {
  dtoToEntity(dto: any): Promise<QueryDeepPartialEntity<any>>;

  entityToDto(entity: DeepPartial<any> | any): Promise<any>;

  dtoFromObject(obj: any): Promise<any>;
}
