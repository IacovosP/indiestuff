import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsSingleColumnToAlbum1606088364776 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "album" ADD COLUMN "isSingle" BOOLEAN DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "isSingle"`);
    }

}
