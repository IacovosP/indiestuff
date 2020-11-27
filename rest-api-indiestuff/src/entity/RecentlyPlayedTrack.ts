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
import { User } from "./User";
import { Track } from "./Track";
import { RecentlyPlayed } from "./RecentlyPlayed";
  
  @Entity()
  export class RecentlyPlayedTrack {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ManyToOne(type => User, user => user.id)
    user: User
        
    @ManyToOne(type => Track, track => track.id, { onDelete:'CASCADE'})
    @JoinColumn({ name: 'track' })
    track: Track;

    @ManyToOne(type => RecentlyPlayed, recentlyPlayed => recentlyPlayed.recentlyPlayedTracks, { onDelete:'CASCADE'})
    @JoinColumn({ name: 'recentlyPlayed' })
    recentlyPlayed: RecentlyPlayed;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  