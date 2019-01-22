import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class PostgresInstance {
  private static postgresCon: string;

  static set SetConnection(config: PostgresConnectionOptions) {
    PostgresInstance.postgresCon = `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${
      config.database
    }`;
  }

  static get GetConnection(): string {
    return PostgresInstance.postgresCon;
  }
}
