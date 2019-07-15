import { BaseService, DataStatus } from '@magishift/base';
import { GetRelationsTableName } from '@magishift/util';
import { HttpException } from '@nestjs/common';
import { FindConditions, FindOneOptions, ObjectLiteral, Repository } from 'typeorm';
import { ResolveFindOptions } from './crud.util';
import { ICrudDto, ICrudEntity } from './interfaces/crud.interface';
import { ICrudMapper } from './interfaces/crudMapper.Interface';
import { ICrudService, IServiceConfig } from './interfaces/crudService.interface';
import { IFilter } from './interfaces/filter.interface';

export abstract class CrudService<TEntity extends ICrudEntity, TDto extends ICrudDto> extends BaseService<TEntity>
  implements ICrudService<TEntity, TDto> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly mapper: ICrudMapper<TEntity, TDto>,
    protected readonly config: IServiceConfig = { softDelete: true },
  ) {
    super(repository);
  }

  async isExist(id: string, ...rest: any[]): Promise<boolean> {
    return !!(await this.repository.findOne(id));
  }

  async count(
    filter: IFilter = {
      offset: 0,
      limit: -1,
      isShowDeleted: false,
    },
    ...rest: any[]
  ): Promise<number> {
    const findOptions = ResolveFindOptions(filter, this.repository);

    const result = await this.repository.count(findOptions);

    return result;
  }

  async fetch(id: string, options?: FindOneOptions<TEntity>, ...rest: any[]): Promise<TDto> {
    options = options || {};
    options.cache = true;

    options.relations = options.relations || GetRelationsTableName(this.repository.metadata);

    const result = await this.repository.findOne(id, options);

    if (!result) {
      throw new HttpException(`${this.constructor.name} FindById with id: (${id}) Not Found`, 404);
    }

    if (result.isDeleted) {
      throw new HttpException(`${this.constructor.name} record with id: "${id}" Has Been Deleted`, 404);
    }

    return this.mapper.entityToDto(result);
  }

  async findOne(param: ObjectLiteral, options?: FindOneOptions<TEntity>, ...rest: any[]): Promise<TDto> {
    options = options || {};
    options.cache = true;
    options.relations = options.relations || GetRelationsTableName(this.repository.metadata);

    const result = await this.repository.findOne({ ...param } as FindConditions<TEntity>, options);

    return this.mapper.entityToDto(result);
  }

  async findAll(
    filter: IFilter = {
      offset: 0,
      limit: 10,
      isShowDeleted: false,
    },
    ...rest: any[]
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

  async create(data: TDto, doValidation: boolean = true, ...rest: any[]): Promise<TDto> {
    if (doValidation) {
      await data.validate();
    }

    if (!data.__meta) {
      data.__meta = {};
    }

    data.__meta.dataStatus = DataStatus.Submitted;
    data.isDeleted = false;

    const entity = await this.mapper.dtoToEntity(data);

    await this.repository.save(entity as any);

    return this.mapper.entityToDto(entity);
  }

  async update(id: string, data: TDto, doValidation: boolean = true, ...rest: any[]): Promise<TDto> {
    if (doValidation) {
      await data.validate();
    }

    const toEntity = await this.mapper.dtoToEntity(data);

    // make sure updated id was not altered
    toEntity.id = id;

    this.repository.save(toEntity as any);

    return this.mapper.entityToDto(toEntity);
  }

  async delete(id: string, ...rest: any[]): Promise<void> {
    const entity = await this.repository.findOneOrFail(id);

    if (this.config.softDelete && !entity.isDeleted) {
      // tslint:disable-next-line:no-any
      const deletedObj: any = {
        isDeleted: true,
      };

      await this.repository.update(id, deletedObj);
    } else {
      await this.repository.delete(id);
    }
  }

  async deleteBulk(ids: string[], ...rest: any[]): Promise<{ [key: string]: string }> {
    const result: { [key: string]: string } = {};

    await Promise.all(
      ids.map(async id => {
        try {
          await this.delete(id);
        } catch (e) {
          result[id] = e.messages;
        }
      }),
    );

    return result;
  }

  async destroy(id: string, ...rest: any[]): Promise<void> {
    await this.repository.delete(id);
  }

  async destroyBulk(ids: string[], ...rest: any[]): Promise<{ [key: string]: string }> {
    const result: { [key: string]: string } = {};

    await Promise.all(
      ids.map(async id => {
        try {
          await this.destroy(id);
        } catch (e) {
          result[id] = e.messages;
        }
      }),
    );

    return result;
  }
}
