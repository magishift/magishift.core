import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  defaultConstraintName(tableOrName: string, columnName: string): string {
    return snakeCase(tableOrName + '_' + columnName);
  }

  relationConstraintName(tableOrName: string, columnNames: string[], where?: string): string {
    return snakeCase('rl_' + tableOrName + columnNames.map(column => '_' + column) + (where ? '_' + where : ''));
  }

  uniqueConstraintName(tableOrName: string, columnNames: string[]): string {
    return snakeCase('uq_' + tableOrName + columnNames.map(column => '_' + column));
  }

  foreignKeyName(tableOrName: string, columnNames: string[]): string {
    return snakeCase('fk_' + tableOrName + columnNames.map(column => '_' + column));
  }

  tableName(className: string, customName: string): string {
    return customName ? customName : snakeCase(className);
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return snakeCase(embeddedPrefixes.join('_')) + (customName ? customName : snakeCase(propertyName));
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string,
  ): string {
    return snakeCase(firstTableName + '_' + firstPropertyName.replace(/\./gi, '_') + '_' + secondTableName);
  }

  joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return snakeCase(tableName + '_' + (columnName ? columnName : propertyName));
  }

  classTableInheritanceParentColumnName(parentTableName: any, parentTableIdPropertyName: any): string {
    return snakeCase(parentTableName + '_' + parentTableIdPropertyName);
  }
}
