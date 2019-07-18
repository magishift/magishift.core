import { GetRelationsTableName } from '@magishift/util';
import { HttpException } from '@nestjs/common';
import { FindConditions, FindOneOptions, ObjectLiteral, Repository } from 'typeorm';
import { IFilter } from './interfaces/filter.interface';
import { IMagiDto, IMagiEntity } from './interfaces/magi.interface';
import { ICrudMapper } from './interfaces/magiMapper.Interface';
import { ICrudService, IDeleteBulkResult } from './interfaces/magiService.interface';
import { ResolveFindOptions } from './magi.util';

export abstract class MagiService<TEntity extends IMagiEntity, TDto extends IMagiDto>
  implements ICrudService<TEntity, TDto> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly mapper: ICrudMapper<TEntity, TDto>,
  ) {}

  async isExist(id: string): Promise<boolean> {
    return !!(await this.repository.findOne(id));
  }

  async count(
    filter: IFilter = {
      offset: 0,
      limit: -1,
      isShowDeleted: false,
    },
  ): Promise<number> {
    const findOptions = ResolveFindOptions(filter, this.repository);

    const result = await this.repository.count(findOptions);

    return result;
  }

  async fetch(id: string, options?: FindOneOptions<TEntity>): Promise<TDto> {
    options = options || {};
    options.cache = true;

    options.relations = options.relations || GetRelationsTableName(this.repository.metadata);

    const result = await this.repository.findOne(id, options);

    if (!result) {
      throw new HttpException(`${this.constructor.name} entity with id: ${id} is not found`, 404);
    }

    if (result.isDeleted) {
      throw new HttpException(`${this.constructor.name} record with id: ${id} is deleted`, 404);
    }

    return this.mapper.entityToDto(result);
  }

  async findOne(param: ObjectLiteral, options?: FindOneOptions<TEntity>): Promise<TDto> {
    options = options || {};
    options.cache = true;
    options.relations = options.relations || GetRelationsTableName(this.repository.metadata);

    const result = await this.repository.findOne({ ...param } as FindConditions<TEntity>, options);

    if (result && result.id) {
      return this.mapper.entityToDto(result);
    }
  }

  async findAll(
    filter: IFilter = {
      offset: 0,
      limit: 10,
      isShowDeleted: false,
    },
  ): Promise<TDto[]> {
    const findOptions = ResolveFindOptions(filter, this.repository);

    // execute query
    const result = await this.repository.find(findOptions);

    // convert entity to DTO before return
    return Promise.all(
      result.map(entity => {
        return this.mapper.entityToDto(entity);
      }),
    );
  }

  async create(data: TDto, doValidation: boolean = true): Promise<TDto> {
    if (!data.__meta) {
      data.__meta = {};
    }

    data.isDeleted = false;

    const entity = await this.mapper.dtoToEntity(data);

    await this.repository.save(entity as any);

    return this.mapper.entityToDto(entity);
  }

  async update(id: string, data: TDto, doValidation: boolean = true): Promise<TDto> {
    const toEntity = await this.mapper.dtoToEntity(data);

    // make sure updated id was not altered
    toEntity.id = id;

    this.repository.save(toEntity as any);

    return this.mapper.entityToDto(toEntity);
  }

  async delete(id: string): Promise<void> {
    // tslint:disable-next-line:no-any
    const deletedObj: any = {
      isDeleted: true,
    };

    await this.repository.update(id, deletedObj);
  }

  async deleteBulk(ids: string[]): Promise<IDeleteBulkResult[]> {
    const result: IDeleteBulkResult[] = [];

    await Promise.all(
      ids.map(async id => {
        try {
          await this.delete(id);

          result.push({ id, status: 'success', errorMessage: null });
        } catch (e) {
          result.push({ id, status: 'error', errorMessage: e.messages });
        }
      }),
    );

    return result;
  }

  async destroy(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async destroyBulk(ids: string[]): Promise<IDeleteBulkResult[]> {
    const result: IDeleteBulkResult[] = [];

    await Promise.all(
      ids.map(async id => {
        try {
          await this.destroy(id);

          result.push({ id, status: 'success', errorMessage: null });
        } catch (e) {
          result.push({ id, status: 'error', errorMessage: e.messages });
        }
      }),
    );

    return result;
  }
}
