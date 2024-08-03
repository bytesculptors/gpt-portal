import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMessage1722674457980 implements MigrationInterface {
    name = 'UpdateMessage1722674457980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "senderId" integer`);
        await queryRunner.query(`ALTER TABLE "message" ADD "receiverId" integer`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_71fb36906595c602056d936fc13" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_71fb36906595c602056d936fc13"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "receiverId"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "senderId"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
