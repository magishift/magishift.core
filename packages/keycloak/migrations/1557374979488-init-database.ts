import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDatabase1557374979488 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "keycloak_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "realm" character varying NOT NULL, "resource" character varying NOT NULL, "authServerUrl" character varying NOT NULL, "public" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_ffdad153cd00a4a0c8c0e165d7c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "keycloak_entity"`);
  }
}
