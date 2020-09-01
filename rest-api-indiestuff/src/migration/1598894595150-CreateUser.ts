import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUser1598894595150 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "email" VARCHAR(255) DEFAULT "someemail@someemail.com"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
