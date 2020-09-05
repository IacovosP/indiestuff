import {MigrationInterface, QueryRunner, getRepository, Table, TableForeignKey, TableColumn} from "typeorm";
import { User } from "../entity/User";
import { Artist } from "../entity/Artist";

export class CreateArtist1599246687611 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = new User();
        user.username = "someUsername";
        user.password = "someUsername";
        user.hashPassword();
        user.role = "MEMBER";
        user.email= "someUsernamee@someemail.com"

        const artist = new Artist();
        artist.name = "someName";
        artist.payment_email = user.email;
        artist.artist_image_filename = "no-image";
        artist.user = user;

        const artistRepository = getRepository(Artist);
        await artistRepository.save(artist);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
