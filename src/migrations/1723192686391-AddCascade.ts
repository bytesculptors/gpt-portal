import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascade1723192686391 implements MigrationInterface {
    name = 'AddCascade1723192686391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "thread" DROP CONSTRAINT "FK_63c2b1000a2c622fe2c4d052537"`);
        await queryRunner.query(`ALTER TABLE "thread" ADD CONSTRAINT "FK_63c2b1000a2c622fe2c4d052537" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "thread" DROP CONSTRAINT "FK_63c2b1000a2c622fe2c4d052537"`);
        await queryRunner.query(`ALTER TABLE "thread" ADD CONSTRAINT "FK_63c2b1000a2c622fe2c4d052537" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
