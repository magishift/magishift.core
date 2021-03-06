import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1555991592924 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "file_storage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "ownerId" character varying NOT NULL, "url" character varying NOT NULL, "object" character varying NOT NULL, "type" character varying NOT NULL, "meta" text NOT NULL DEFAULT '{}', "permissions" text NOT NULL DEFAULT '["public"]', "storage" character varying NOT NULL DEFAULT 'local', "dataStatus" character varying NOT NULL DEFAULT 'submitted', CONSTRAINT "UQ_f7ccb9ca8a5735d3750519f38c1" UNIQUE ("url"), CONSTRAINT "PK_2834b5398654dd125afabfd0dc2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "device" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "ownerId" character varying NOT NULL, "deviceFcmToken" character varying NOT NULL, "deviceInfo" json NOT NULL, CONSTRAINT "UQ_e0fbeb939719ea79af4dd04fe89" UNIQUE ("deviceFcmToken"), CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "from" character varying NOT NULL, "to" character varying NOT NULL, "title" character varying NOT NULL, "message" character varying NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "back_office_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "accountId" character varying NOT NULL, "username" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "emailVerified" boolean NOT NULL DEFAULT true, "firstName" character varying, "lastName" character varying, "email" character varying, "phoneNumber" character varying, "photoId" uuid, CONSTRAINT "UQ_058272776a5740ce30314828a89" UNIQUE ("accountId"), CONSTRAINT "UQ_f87f32cc7a478d622615d96045c" UNIQUE ("username"), CONSTRAINT "UQ_eec381383d69639cc37a123888b" UNIQUE ("email"), CONSTRAINT "UQ_c08cc7b5424e3eee294a55a6852" UNIQUE ("phoneNumber"), CONSTRAINT "PK_94b24c219523b13d58510824a53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "back_office_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_41ec772faeb102a71336c0870f9" UNIQUE ("name"), CONSTRAINT "PK_8b8661dd4c1ac93a532c9ffed34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "type" character varying NOT NULL, "subject" character varying NOT NULL, "template" character varying NOT NULL, CONSTRAINT "UQ_97344a0cde4fb739c90d59a3eb9" UNIQUE ("type"), CONSTRAINT "PK_c90815fd4ca9119f19462207710" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "index" integer, "title" character varying, "url" character varying NOT NULL, "authorization" character varying, "method" character varying NOT NULL DEFAULT 'GET', CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sms_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "type" character varying NOT NULL, "template" character varying NOT NULL, CONSTRAINT "UQ_fa79256389ca9f59bf65e55ea21" UNIQUE ("type"), CONSTRAINT "PK_45ec1b31ab51b54b8180ef5e8d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "autocomplete" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "data" character varying, CONSTRAINT "PK_5523204bb8469c2025bcb0b55bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "checkbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "data" character varying, CONSTRAINT "PK_08bea723d86e24471056165fb76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "status" character varying, "domain" character varying NOT NULL, "logoId" uuid, CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_user_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_277e09d6db510e49856627e8db7" UNIQUE ("name"), CONSTRAINT "PK_99c984ad90de07bc504ff2e120d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "accountId" character varying NOT NULL, "username" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "emailVerified" boolean NOT NULL DEFAULT true, "firstName" character varying, "lastName" character varying, "email" character varying, "phoneNumber" character varying, "photoId" uuid, "tenantId" uuid, CONSTRAINT "UQ_2e31a305983f47d50ea15703d90" UNIQUE ("accountId"), CONSTRAINT "UQ_068bce4f49c74113183beac5a45" UNIQUE ("username"), CONSTRAINT "UQ_57737f7835a77e39967ab4b0d00" UNIQUE ("email"), CONSTRAINT "UQ_0608cf228e7f49a3a7ad25fb25e" UNIQUE ("phoneNumber"), CONSTRAINT "PK_f18a6fabea7b2a90ab6bf10a650" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor_expert_team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "expertise" character varying NOT NULL, "cvId" uuid, "vendorId" uuid, CONSTRAINT "PK_55bb63729313db620644975aaa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor_user_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_5228532e2b4732a4771a206763a" UNIQUE ("name"), CONSTRAINT "PK_9d4d420a77caf70cf5274c979b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "accountId" character varying NOT NULL, "username" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "emailVerified" boolean NOT NULL DEFAULT true, "firstName" character varying, "lastName" character varying, "email" character varying, "phoneNumber" character varying, "canLogin" boolean NOT NULL DEFAULT true, "photoId" uuid, "vendorId" uuid, CONSTRAINT "UQ_8517f100af6d5f3e0d25ae0a090" UNIQUE ("accountId"), CONSTRAINT "UQ_f7e0f0bbf72933233cc9a705312" UNIQUE ("username"), CONSTRAINT "UQ_6136b777aa121756218fa70ee7b" UNIQUE ("email"), CONSTRAINT "UQ_4cf2621927a6c619ae440e50882" UNIQUE ("phoneNumber"), CONSTRAINT "PK_139dbded1008da1588c16f34a40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "companyName" character varying NOT NULL, "legalType" character varying NOT NULL, "officeAddress" character varying NOT NULL, "country" character varying NOT NULL, "province" character varying NOT NULL, "city" character varying NOT NULL, "district" character varying NOT NULL, "village" character varying NOT NULL, "postalCode" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "faxNumber" character varying, "email" character varying NOT NULL, "website" character varying, "cpName" character varying, "cpPhoneNumber" character varying, "cpEmail" character varying, "status" character varying NOT NULL, "category" character varying, "npwpId" uuid, CONSTRAINT "PK_931a23f6231a57604f5a0e32780" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "bid" integer, "resourceTotal" integer, "experience" integer, "status" character varying, "documentId" uuid, "participantId" uuid, "tenderId" uuid, CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tender" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "type" character varying NOT NULL, "code" character varying NOT NULL, "title" character varying NOT NULL, "category" character varying NOT NULL, "description" character varying NOT NULL, "ownership" character varying NOT NULL, "fiscalYear" integer NOT NULL, "tenderPrice" integer NOT NULL, "qualification" character varying NOT NULL, "dueDate" TIMESTAMP NOT NULL, "currentPhase" character varying NOT NULL, "qualificationDocumentId" uuid, "winnerId" uuid, "packetId" uuid, CONSTRAINT "PK_cf05759ac4297391f87db210f64" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "packet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "title" character varying NOT NULL, "code" character varying NOT NULL, "sourceOfFund" character varying NOT NULL, "ownerDepartment" character varying NOT NULL, "workUnit" character varying NOT NULL, CONSTRAINT "PK_0bef789c4d597bd0b7723f6d878" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "picker" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "data" character varying, CONSTRAINT "PK_d10df3dae98ab1a5fd59283b658" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "select" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "data" character varying, CONSTRAINT "PK_7ebce51213ac92f4f70753af76c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "text_input" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "__meta" text, "isDeleted" boolean NOT NULL DEFAULT false, "data" character varying, CONSTRAINT "PK_c01a5bba54621f2faf42583949c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "back_office_user_realm_roles_back_office_role" ("backOfficeUserId" uuid NOT NULL, "backOfficeRoleId" uuid NOT NULL, CONSTRAINT "PK_5a8dbe7756b7b79de766165d685" PRIMARY KEY ("backOfficeUserId", "backOfficeRoleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fd252ddf04a2d40ba93264b390" ON "back_office_user_realm_roles_back_office_role" ("backOfficeUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bf3cfb2807aba9252e02b53aa6" ON "back_office_user_realm_roles_back_office_role" ("backOfficeRoleId") `);
        await queryRunner.query(`CREATE TABLE "client_user_realm_roles_client_user_role" ("clientUserId" uuid NOT NULL, "clientUserRoleId" uuid NOT NULL, CONSTRAINT "PK_85e52f584c0489bb32eb26268bc" PRIMARY KEY ("clientUserId", "clientUserRoleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9fb8b0d2567c79e35fb80e5c93" ON "client_user_realm_roles_client_user_role" ("clientUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9ecb7138ab099fbc00c83864ac" ON "client_user_realm_roles_client_user_role" ("clientUserRoleId") `);
        await queryRunner.query(`CREATE TABLE "vendor_user_realm_roles_vendor_user_role" ("vendorUserId" uuid NOT NULL, "vendorUserRoleId" uuid NOT NULL, CONSTRAINT "PK_386ae57bed9b5bdcc798f59c754" PRIMARY KEY ("vendorUserId", "vendorUserRoleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c2cf90cc9bae453c2ddb369745" ON "vendor_user_realm_roles_vendor_user_role" ("vendorUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f00a616a2e5dd2cf7294a404d5" ON "vendor_user_realm_roles_vendor_user_role" ("vendorUserRoleId") `);
        await queryRunner.query(`ALTER TABLE "back_office_user" ADD CONSTRAINT "FK_36523e8e28e49f9b76a75dc72f6" FOREIGN KEY ("photoId") REFERENCES "file_storage"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD CONSTRAINT "FK_0ed69b4239b1f892b96798065a1" FOREIGN KEY ("logoId") REFERENCES "file_storage"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD CONSTRAINT "FK_21157504e5cb976671d0e464157" FOREIGN KEY ("photoId") REFERENCES "file_storage"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_user" ADD CONSTRAINT "FK_33a886edf03c86de7fae44defff" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_expert_team" ADD CONSTRAINT "FK_d707801662d07da296c275e0987" FOREIGN KEY ("cvId") REFERENCES "file_storage"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_expert_team" ADD CONSTRAINT "FK_b1fd715828c3c65e06036ee03d2" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_user" ADD CONSTRAINT "FK_5cdf1f861608b1b341faef747c8" FOREIGN KEY ("photoId") REFERENCES "file_storage"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_user" ADD CONSTRAINT "FK_58b037f882dcc36ee8bdbf75a8b" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor" ADD CONSTRAINT "FK_f069248ed7350e56c650e28fdbf" FOREIGN KEY ("npwpId") REFERENCES "file_storage"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_144f1971222a35c51f37973068e" FOREIGN KEY ("documentId") REFERENCES "file_storage"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_69ccb90fdd22eb00df80d6cd35d" FOREIGN KEY ("participantId") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_8942b84e25329d27c04254ab9b2" FOREIGN KEY ("tenderId") REFERENCES "tender"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tender" ADD CONSTRAINT "FK_dbf7a2771a9f8b8f4e4dbcc9ac0" FOREIGN KEY ("qualificationDocumentId") REFERENCES "file_storage"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tender" ADD CONSTRAINT "FK_b1cb42181cbae760b8ebeeb7973" FOREIGN KEY ("winnerId") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tender" ADD CONSTRAINT "FK_9d20ae4cff8c3dd9b02cef5dbd2" FOREIGN KEY ("packetId") REFERENCES "packet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "back_office_user_realm_roles_back_office_role" ADD CONSTRAINT "FK_fd252ddf04a2d40ba93264b3901" FOREIGN KEY ("backOfficeUserId") REFERENCES "back_office_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "back_office_user_realm_roles_back_office_role" ADD CONSTRAINT "FK_bf3cfb2807aba9252e02b53aa6e" FOREIGN KEY ("backOfficeRoleId") REFERENCES "back_office_role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_user_realm_roles_client_user_role" ADD CONSTRAINT "FK_9fb8b0d2567c79e35fb80e5c933" FOREIGN KEY ("clientUserId") REFERENCES "client_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_user_realm_roles_client_user_role" ADD CONSTRAINT "FK_9ecb7138ab099fbc00c83864ace" FOREIGN KEY ("clientUserRoleId") REFERENCES "client_user_role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_user_realm_roles_vendor_user_role" ADD CONSTRAINT "FK_c2cf90cc9bae453c2ddb369745f" FOREIGN KEY ("vendorUserId") REFERENCES "vendor_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_user_realm_roles_vendor_user_role" ADD CONSTRAINT "FK_f00a616a2e5dd2cf7294a404d54" FOREIGN KEY ("vendorUserRoleId") REFERENCES "vendor_user_role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "vendor_user_realm_roles_vendor_user_role" DROP CONSTRAINT "FK_f00a616a2e5dd2cf7294a404d54"`);
        await queryRunner.query(`ALTER TABLE "vendor_user_realm_roles_vendor_user_role" DROP CONSTRAINT "FK_c2cf90cc9bae453c2ddb369745f"`);
        await queryRunner.query(`ALTER TABLE "client_user_realm_roles_client_user_role" DROP CONSTRAINT "FK_9ecb7138ab099fbc00c83864ace"`);
        await queryRunner.query(`ALTER TABLE "client_user_realm_roles_client_user_role" DROP CONSTRAINT "FK_9fb8b0d2567c79e35fb80e5c933"`);
        await queryRunner.query(`ALTER TABLE "back_office_user_realm_roles_back_office_role" DROP CONSTRAINT "FK_bf3cfb2807aba9252e02b53aa6e"`);
        await queryRunner.query(`ALTER TABLE "back_office_user_realm_roles_back_office_role" DROP CONSTRAINT "FK_fd252ddf04a2d40ba93264b3901"`);
        await queryRunner.query(`ALTER TABLE "tender" DROP CONSTRAINT "FK_9d20ae4cff8c3dd9b02cef5dbd2"`);
        await queryRunner.query(`ALTER TABLE "tender" DROP CONSTRAINT "FK_b1cb42181cbae760b8ebeeb7973"`);
        await queryRunner.query(`ALTER TABLE "tender" DROP CONSTRAINT "FK_dbf7a2771a9f8b8f4e4dbcc9ac0"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_8942b84e25329d27c04254ab9b2"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_69ccb90fdd22eb00df80d6cd35d"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_144f1971222a35c51f37973068e"`);
        await queryRunner.query(`ALTER TABLE "vendor" DROP CONSTRAINT "FK_f069248ed7350e56c650e28fdbf"`);
        await queryRunner.query(`ALTER TABLE "vendor_user" DROP CONSTRAINT "FK_58b037f882dcc36ee8bdbf75a8b"`);
        await queryRunner.query(`ALTER TABLE "vendor_user" DROP CONSTRAINT "FK_5cdf1f861608b1b341faef747c8"`);
        await queryRunner.query(`ALTER TABLE "vendor_expert_team" DROP CONSTRAINT "FK_b1fd715828c3c65e06036ee03d2"`);
        await queryRunner.query(`ALTER TABLE "vendor_expert_team" DROP CONSTRAINT "FK_d707801662d07da296c275e0987"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP CONSTRAINT "FK_33a886edf03c86de7fae44defff"`);
        await queryRunner.query(`ALTER TABLE "client_user" DROP CONSTRAINT "FK_21157504e5cb976671d0e464157"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP CONSTRAINT "FK_0ed69b4239b1f892b96798065a1"`);
        await queryRunner.query(`ALTER TABLE "back_office_user" DROP CONSTRAINT "FK_36523e8e28e49f9b76a75dc72f6"`);
        await queryRunner.query(`DROP INDEX "IDX_f00a616a2e5dd2cf7294a404d5"`);
        await queryRunner.query(`DROP INDEX "IDX_c2cf90cc9bae453c2ddb369745"`);
        await queryRunner.query(`DROP TABLE "vendor_user_realm_roles_vendor_user_role"`);
        await queryRunner.query(`DROP INDEX "IDX_9ecb7138ab099fbc00c83864ac"`);
        await queryRunner.query(`DROP INDEX "IDX_9fb8b0d2567c79e35fb80e5c93"`);
        await queryRunner.query(`DROP TABLE "client_user_realm_roles_client_user_role"`);
        await queryRunner.query(`DROP INDEX "IDX_bf3cfb2807aba9252e02b53aa6"`);
        await queryRunner.query(`DROP INDEX "IDX_fd252ddf04a2d40ba93264b390"`);
        await queryRunner.query(`DROP TABLE "back_office_user_realm_roles_back_office_role"`);
        await queryRunner.query(`DROP TABLE "text_input"`);
        await queryRunner.query(`DROP TABLE "select"`);
        await queryRunner.query(`DROP TABLE "picker"`);
        await queryRunner.query(`DROP TABLE "packet"`);
        await queryRunner.query(`DROP TABLE "tender"`);
        await queryRunner.query(`DROP TABLE "participant"`);
        await queryRunner.query(`DROP TABLE "vendor"`);
        await queryRunner.query(`DROP TABLE "vendor_user"`);
        await queryRunner.query(`DROP TABLE "vendor_user_role"`);
        await queryRunner.query(`DROP TABLE "vendor_expert_team"`);
        await queryRunner.query(`DROP TABLE "client_user"`);
        await queryRunner.query(`DROP TABLE "client_user_role"`);
        await queryRunner.query(`DROP TABLE "tenant"`);
        await queryRunner.query(`DROP TABLE "checkbox"`);
        await queryRunner.query(`DROP TABLE "autocomplete"`);
        await queryRunner.query(`DROP TABLE "sms_template"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TABLE "email_template"`);
        await queryRunner.query(`DROP TABLE "back_office_role"`);
        await queryRunner.query(`DROP TABLE "back_office_user"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "device"`);
        await queryRunner.query(`DROP TABLE "file_storage"`);
    }

}
