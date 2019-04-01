import _ = require('lodash');
import { ColumnType, EntityMetadata } from 'typeorm';
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

export const getRelationsTableName = (metadata: EntityMetadata): { key: string; isManyToMany?: boolean }[] => {
  const relations = [];

  _.filter(metadata.columns, 'relationMetadata').map(relation => {
    relations.push({ key: relation.relationMetadata.propertyName, isManyToMany: false });
  });

  _.filter(metadata.relations, 'isManyToManyOwner').map(relation => {
    relations.push({ key: relation.propertyName, isManyToMany: true });
  });

  return relations;
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
