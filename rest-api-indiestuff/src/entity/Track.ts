import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Length, IsNotEmpty } from "class-validator";
  
  @Entity()
  export class Track {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @Length(2, 150)
    @IsNotEmpty()
    name: string;
  
    @Column()
    @IsNotEmpty()
    album_id: number;

    @Column()
    @IsNotEmpty()
    artist_id: number;

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
  