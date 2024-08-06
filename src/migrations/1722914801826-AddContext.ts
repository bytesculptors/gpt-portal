import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContext1722914801826 implements MigrationInterface {
    name = 'AddContext1722914801826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "thread" ADD "context" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "thread" DROP COLUMN "context"`);
    }

}
