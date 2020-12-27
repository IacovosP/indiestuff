import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from "typeorm";
  import { Length, IsNotEmpty } from "class-validator";
import { Artist } from "./Artist";
import { AlbumInterface } from "../../types/lib";
  
  @Entity()
  export class Album implements AlbumInterface{
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column()
    @Length(2, 50)
    @IsNotEmpty()
    title: string;
  
    @ManyToOne(type => Artist, artist => artist.id, { eager: true })
    @JoinColumn({ name: 'artist' })
    artist: Artist
  
    @Column()
    album_image_filename: string;

    @Column()
    colour: string;
  
    @Column()
    isSingle: boolean;

    @Column()
    releaseDate: Date;

    @Column()
    durationInSec: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    public static mockTestAlbum(): Album {
      const album: Album = new Album();
  
      album.id = "albumTestId";
      album.title = 'testTitle';
      album.artist = {id: 'albumArtistTestId'} as any;
      album.album_image_filename = 'mockAlbumImageName';
      album.colour = 'mockColour';
      album.releaseDate = new Date();
      album.durationInSec = 50;
      album.isSingle = false;
      album.createdAt = new Date();
      album.updatedAt = new Date();

      return album;
    }
  }
  