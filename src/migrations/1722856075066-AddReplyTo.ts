import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReplyTo1722856075066 implements MigrationInterface {
    name = 'AddReplyTo1722856075066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "replyToId" integer`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "UQ_dc84d76f927b87f616cbedcf2e5" UNIQUE ("replyToId")`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_dc84d76f927b87f616cbedcf2e5" FOREIGN KEY ("replyToId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_dc84d76f927b87f616cbedcf2e5"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "UQ_dc84d76f927b87f616cbedcf2e5"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "replyToId"`);
    }

}
