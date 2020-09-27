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
import { Track } from "./Track";
import { User } from "./User";
  
  @Entity()
  export class LikedTrack {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ManyToOne(type => User, user => user.id)
    @JoinColumn({ name: 'user' })
    user: User
  
    @ManyToOne(type => Track, track => track.id)
    @JoinColumn({ name: 'track' })
    track: Track;
    
    @Column()
    @IsNotEmpty()
    positionInPlaylist: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  