import { Validator } from 'class-validator';
import { DeepPartial, getRepository, ObjectLiteral, Repository } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { getPropertyType } from '../database/utils.database';
import { Dto2Entity, DtoFromObject, Entity2Dto } from '../utils/objectMapper.utils';
import { ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';

const validator = new Validator();

export abstract class CrudMapper<TEntity extends ICrudEntity, TDto extends ICrudDto>
  implements ICrudMapper<TEntity, TDto> {
  constructor(protected entity: new () => TEntity, protected dto: new () => TDto) {
    if (!entity || !dto) {
      throw new Error(`${this.constructor.name} must have constructor`);
    }
  }

  protected get getNewEntity(): TEntity {
    return new this.entity();
  }

  protected get getNewDto(): TDto {
    return new this.dto();
  }

  protected get repository(): Repository<TEntity> {
    return this.getNewEntity.getRepository();
  }

  async dtoToEntity(dto: TDto): Promise<QueryDeepPartialEntity<TEntity>> {
    delete dto.__meta;

    return Dto2Entity(dto, this.getNewEntity);
  }

  async entityToDto(entity: DeepPartial<TEntity> | TEntity | ObjectLiteral): Promise<TDto> {
    const dto = Entity2Dto(entity as TEntity, this.getNewDto);

    return dto;
  }

  async dtoFromObject(obj: TDto): Promise<TDto> {
    const result = DtoFromObject(obj, this.getNewDto);

    await Promise.all(
      this.repository.metadata.columns.map(async (column: ColumnMetadata) => {
        const propType = getPropertyType(this.repository.metadata.columns, column.propertyName);

        if (
          result[column.propertyName] &&
          propType === 'uuid' &&
          validator.isUUID(result[column.propertyName]) &&
          column.relationMetadata
        ) {
          const relationsRepository = getRepository(column.relationMetadata.inverseEntityMetadata.name);
          result[column.propertyName] = await relationsRepository.findOneOrFail(result[column.propertyName]);
        } else if (propType === 'boolean' || propType === 'bool') {
          if (typeof result[column.propertyName] === 'string') {
            result[column.propertyName] = result[column.propertyName].toLowerCase() === 'true';
          }
        }
      }),
    );

    return result;
  }
}
