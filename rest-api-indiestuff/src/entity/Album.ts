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
  
  @Entity()
  export class Album {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @Length(4, 50)
    @IsNotEmpty()
    name: string;
  
    @ManyToOne(type => Artist, artist => artist.id)
    @JoinColumn({ name: 'artist' })
    artist: Artist
  
    @Column()
    album_image_filename: string;

    @Column()
    colour: string;
  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  