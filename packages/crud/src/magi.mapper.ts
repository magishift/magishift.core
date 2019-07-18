import _ = require('lodash');
import { DeepPartial, getRepository, ObjectLiteral, Repository } from 'typeorm';
import { ICrudMapper } from './interfaces/magiMapper.Interface';
import { MagiDto } from './magi.dto';
import { MagiEntity } from './magi.entity';

export abstract class MagiMapper<TEntity extends MagiEntity, TDto extends MagiDto>
  implements ICrudMapper<TEntity, TDto> {
  constructor(protected entity: new () => TEntity, protected dto: new () => TDto) {
    if (!entity || !dto) {
      throw new Error(`${this.constructor.name} must have constructor`);
    }
  }

  protected get repository(): Repository<TEntity> {
    return getRepository(this.entity);
  }

  async dtoToEntity(dto: TDto): Promise<TEntity> {
    if (_.isEmpty(dto)) {
      return;
    }

    const entity: DeepPartial<TEntity> = {};

    _.forEach(dto, (value, key) => {
      entity[key] = value;
    });

    return this.repository.create(entity);
  }

  async entityToDto(entity: DeepPartial<TEntity> | TEntity | ObjectLiteral): Promise<TDto> {
    if (_.isEmpty(entity)) {
      return;
    }

    const dto: TDto = new this.dto();

    _.forEach(entity, (value, key) => {
      dto[key] = value;
    });

    return dto;
  }
}
