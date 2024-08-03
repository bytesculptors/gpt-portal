import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateThread1722673979748 implements MigrationInterface {
    name = 'UpdateThread1722673979748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_threads_member_thread" DROP CONSTRAINT "FK_be9cf1ef8c1412e20560f830029"`);
        await queryRunner.query(`ALTER TABLE "user_threads_member_thread" ADD CONSTRAINT "FK_be9cf1ef8c1412e20560f830029" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_threads_member_thread" DROP CONSTRAINT "FK_be9cf1ef8c1412e20560f830029"`);
        await queryRunner.query(`ALTER TABLE "user_threads_member_thread" ADD CONSTRAINT "FK_be9cf1ef8c1412e20560f830029" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
