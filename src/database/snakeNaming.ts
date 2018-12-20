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
}
