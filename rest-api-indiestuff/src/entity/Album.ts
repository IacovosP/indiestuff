import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Length, IsNotEmpty } from "class-validator";
  
  @Entity()
  export class Album {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @Length(4, 50)
    @IsNotEmpty()
    name: string;
  
    @Column()
    @IsNotEmpty()
    artist_id: number;
  
    @Column()
    album_image_id: number;

    @Column()
    colour: string;
  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  