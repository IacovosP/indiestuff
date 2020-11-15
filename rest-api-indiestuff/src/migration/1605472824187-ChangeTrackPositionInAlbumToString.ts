import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class ChangeTrackPositionInAlbumToString1605472824187 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE track MODIFY COLUMN position_in_album varchar(255)`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
