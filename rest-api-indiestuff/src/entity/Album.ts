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
import { AlbumInterface } from "@apistuff";
  
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
    releaseDate: Date;

    @Column()
    durationInSec: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  