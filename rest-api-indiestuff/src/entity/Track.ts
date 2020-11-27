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
  
    @ManyToOne(type => Album, album => album.id, { eager: true, onDelete:'CASCADE'})
    @JoinColumn({ name: 'album' })
    album: Album

    @ManyToOne(type => Artist, artist => artist.id, { eager: true, onDelete:'CASCADE' })
    @JoinColumn({ name: 'artist' })
    artist: Artist

    @Column()
    @IsNotEmpty()
    filename: string;

    @Column()
    @IsNotEmpty()
    positionInAlbum: string;

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
  