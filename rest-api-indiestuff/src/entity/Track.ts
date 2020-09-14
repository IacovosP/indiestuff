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
import { Album } from "./Album";
import { TrackInterface } from "@apistuff";
  
  @Entity()
  export class Track implements TrackInterface {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column()
    @Length(2, 150)
    @IsNotEmpty()
    title: string;
  
    @ManyToOne(type => Album, album => album.id)
    @JoinColumn({ name: 'album' })
    album: Album

    @ManyToOne(type => Artist, artist => artist.id)
    @JoinColumn({ name: 'artist' })
    artist: Artist

    @Column()
    @IsNotEmpty()
    filename: string;

    @Column()
    @IsNotEmpty()
    positionInAlbum: number;

    @Column()
    @IsNotEmpty()
    durationInSec: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  