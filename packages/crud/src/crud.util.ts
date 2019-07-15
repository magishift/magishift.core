import { ColumnIsNumber, GetPropertyType, GetRelationsTableName } from '@magishift/util';
import _ = require('lodash');
import { FindConditions, FindManyOptions, Like, Repository } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { ICrudEntity } from './interfaces/crud.interface';
import { IFilter } from './interfaces/filter.interface';

export function ResolveFindOptions<TEntity extends ICrudEntity>(
  filter: IFilter,
  repository: Repository<TEntity>,
): FindManyOptions {
  if (!filter.relations) {
    filter.relations = GetRelationsTableName(repository.metadata);
  }

  let where: FindConditions<TEntity> = {};

  if (filter.where && !_.isEmpty(filter.where)) {
    where = ResolveWhereOperator(filter.where, repository.metadata.columns);
  }

  if (filter.isShowDeleted) {
    (where as any).isDeleted = true;
  } else {
    (where as any).isDeleted = false;
  }

  const whereOrs: FindConditions<TEntity>[] = [];

  if (filter.whereOr && !_.isEmpty(filter.whereOr)) {
    whereOrs.push({ ...(where || {}), ...ResolveWhereOperator(filter.whereOr, repository.metadata.columns) });
  }

  const order: { [P in keyof TEntity]?: 'ASC' | 'DESC' | 1 | -1 } = {};

  if (filter.order) {
    filter.order.map(ord => {
      const orders = ord.split(' ');
      if (orders.length === 2) {
        order[orders[0]] = orders[1];
      }
    });
  }

  const result: FindManyOptions = {
    relations: filter.relations,
    where: whereOrs && whereOrs.length > 0 ? whereOrs : where,
    order,
    skip: filter.offset,
    take: filter.limit,
    cache: true,
  };

  return result;
}

function ResolveWhereOperator<TEntity extends ICrudEntity>(
  source: object,
  columns: ColumnMetadata[],
): FindConditions<TEntity> {
  const result: FindConditions<TEntity> = {};

  _.forEach(source, (val: string, prop: string) => {
    const value: string = val;

    const propertyType = GetPropertyType(columns, prop);

    if (
      propertyType &&
      (propertyType === 'boolean' || propertyType === 'bool' || propertyType === 'uuid' || ColumnIsNumber(propertyType))
    ) {
      result[prop] = value;
    } else {
      result[prop] = Like('%' + value + '%');
    }
  });

  return result;
}
