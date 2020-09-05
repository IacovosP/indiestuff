import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Length, IsNotEmpty } from "class-validator";
  
  @Entity()
  export class Playlist {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @IsNotEmpty()
    playlist_id: number;
  
    @Column()
    @IsNotEmpty()
    track_id: number;
    
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  