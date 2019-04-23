import _ = require('lodash');
import { ColumnType, EntityMetadata } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

export const GetPropertyType = (columns: ColumnMetadata[], propertyName: string): ColumnType | void => {
  const property: ColumnMetadata = _.find(columns, { propertyName });

  if (property && property.type && (property.type as any).name) {
    return (property.type as any).name.toLowerCase();
  }

  if (property && property.type) {
    return property.type;
  }
};

export const GetRelationsTableName = (metadata: EntityMetadata): string[] => {
  const relations = [];

  _.filter(metadata.columns, 'relationMetadata').map(relation => {
    relations.push(relation.relationMetadata.propertyName);
  });

  _.filter(metadata.relations, 'isManyToManyOwner').map(relation => {
    relations.push(relation.propertyName);
  });

  return relations;
};

export const ColumnIsNumber = (columnType: ColumnType): boolean => {
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
    ].indexOf(columnType.toString().toLowerCase()) > 0
  );
};
