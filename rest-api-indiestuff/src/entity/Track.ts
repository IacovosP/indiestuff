import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToOne
  } from "typeorm";
  import { Length, IsNotEmpty } from "class-validator";
import { Artist } from "./Artist";
import { Album } from "./Album";
  
  @Entity()
  export class Track {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @Length(2, 150)
    @IsNotEmpty()
    name: string;
  

    @OneToOne(type => Album, album => album.id)
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
    durationInSeconds: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  