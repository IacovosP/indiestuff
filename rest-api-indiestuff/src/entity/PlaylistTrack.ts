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
import { Playlist } from "./Playlist";
  
  @Entity()
  export class PlaylistTrack {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ManyToOne(type => Playlist, playlist => playlist.id)
    @JoinColumn({ name: 'playlist' })
    playlist: number;
  
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
  