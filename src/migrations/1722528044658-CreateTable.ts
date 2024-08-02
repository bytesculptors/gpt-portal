import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1722528044658 implements MigrationInterface {
    name = 'CreateTable1722528044658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "abstract_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_55bf07336ea469593601bccfe9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" character varying NOT NULL, "threadId" integer, "userId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "isActivated" boolean NOT NULL DEFAULT false, "role" "public"."user_role_enum" NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "thread" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "creatorId" integer, CONSTRAINT "PK_cabc0f3f27d7b1c70cf64623e02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_threads_member_thread" ("userId" integer NOT NULL, "threadId" integer NOT NULL, CONSTRAINT "PK_ccfc4f836f5a605ab94b65fba77" PRIMARY KEY ("userId", "threadId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3f6d7a520cfac10e605c363ab8" ON "user_threads_member_thread" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_be9cf1ef8c1412e20560f83002" ON "user_threads_member_thread" ("threadId") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_97e5c5b5590c682a6c487816b6b" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "thread" ADD CONSTRAINT "FK_63c2b1000a2c622fe2c4d052537" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_threads_member_thread" ADD CONSTRAINT "FK_3f6d7a520cfac10e605c363ab84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_threads_member_thread" ADD CONSTRAINT "FK_be9cf1ef8c1412e20560f830029" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`INSERT INTO "user"(email, username, password, role) VALUES ('john123@gmail.com', 'john123', '$2a$12$aKYsqpdZdgYzXDMZ1cwlx.zvlcj/pQLyGhYKzgNbsU1QrKY50DK7G', 'admin') `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_threads_member_thread" DROP CONSTRAINT "FK_be9cf1ef8c1412e20560f830029"`);
        await queryRunner.query(`ALTER TABLE "user_threads_member_thread" DROP CONSTRAINT "FK_3f6d7a520cfac10e605c363ab84"`);
        await queryRunner.query(`ALTER TABLE "thread" DROP CONSTRAINT "FK_63c2b1000a2c622fe2c4d052537"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_97e5c5b5590c682a6c487816b6b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be9cf1ef8c1412e20560f83002"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f6d7a520cfac10e605c363ab8"`);
        await queryRunner.query(`DROP TABLE "user_threads_member_thread"`);
        await queryRunner.query(`DROP TABLE "thread"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "abstract_entity"`);
    }

}
