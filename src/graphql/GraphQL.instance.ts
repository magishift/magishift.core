import { ExecutionResult, graphql, GraphQLSchema, Source } from 'graphql';
import Maybe from 'graphql/tsutils/Maybe';
import { Pool } from 'pg';
import { createPostGraphileSchema, withPostGraphileContext } from 'postgraphile';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export interface IGqlParam {
  operationName?: string;
  query: Source | string;
  variables: Maybe<{ [key: string]: any }>;
}

export class GraphQLInstance {
  static async performQuery(param: IGqlParam): Promise<ExecutionResult> {
    const result = await withPostGraphileContext(
      {
        pgPool: this.pgPool,
      },
      async (context: object) => {
        return await graphql(
          this.graphqlSchema,
          param.query,
          null,
          { ...context },
          param.variables,
          param.operationName,
        );
      },
    );

    return result.data;
  }

  public static graphqlSchema: GraphQLSchema;
  private static pgPool: Pool;
  private static username: string;
  private static password: string;
  private static host: string;
  private static port: number;
  private static database: string;

  static async initialize({
    username,
    password,
    host,
    port,
    database,
  }: PostgresConnectionOptions): Promise<GraphQLSchema> {
    GraphQLInstance.pgPool = new Pool({
      user: username,
      password,
      host,
      port,
      database,
    });

    this.username = username;
    this.password = password;
    this.host = host;
    this.port = port;
    this.database = database;

    return GraphQLInstance.createSchema();
  }

  private static async createSchema(): Promise<GraphQLSchema> {
    GraphQLInstance.graphqlSchema = await createPostGraphileSchema(
      `postgres://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`,
      'public',
      {
        dynamicJson: true,
      },
    );

    return GraphQLInstance.graphqlSchema;
  }
}
