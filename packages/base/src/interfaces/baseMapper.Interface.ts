import { DeepPartial } from 'typeorm';

export interface IBaseMapper {
  dtoToEntity(dto: any): Promise<any>;

  entityToDto(entity: DeepPartial<any> | any): Promise<any>;

  dtoFromObject(obj: any): Promise<any>;
}
