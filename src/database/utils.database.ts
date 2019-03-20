import _ = require('lodash');
import { ColumnType } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

export const getPropertyType = (columns: ColumnMetadata[], propertyName: string): ColumnType | void => {
  const property: ColumnMetadata = _.find(columns, { propertyName });

  if (property && property.type && (property.type as any).name) {
    return (property.type as any).name.toLowerCase();
  }

  if (property && property.type) {
    return property.type;
  }
};

export const getRelationsName = (columns: ColumnMetadata[]): string[] => {
  const relations: ColumnMetadata[] = _.filter(columns, 'relationMetadata');

  const relationsName = [];

  relations.map(relation => {
    relationsName.push(relation.relationMetadata.propertyName);
  });

  return relationsName;
};

export const getRelationsTableName = (columns: ColumnMetadata[]): string[] => {
  const relations: ColumnMetadata[] = _.filter(columns, 'relationMetadata');

  const relationsTableName = [];

  relations.map(relation => {
    relationsTableName.push(relation.relationMetadata.inverseEntityMetadata.name);
  });

  return relationsTableName;
};

export const isPropertyTypeNumber = (propertyType: ColumnType): boolean => {
  return (
    [
      'int',
      'int2',
      'int2',
      'int4',
      'int8',
      'integer',
      'tinyint',
      'smallint',
      'mediumint',
      'bigint',
      'dec',
      'decimal',
      'numeric',
      'number',
    ].indexOf(propertyType.toString().toLowerCase()) > 0
  );
};
