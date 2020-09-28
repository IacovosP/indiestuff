import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
  } from "typeorm";
import { User } from "./User";
import { Album } from "./Album";
import { Artist } from "./Artist";
import { Track } from "./Track";
import { RecentlyPlayedTrack } from "./RecentlyPlayedTrack";
  
  @Entity()
  export class RecentlyPlayed {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ManyToOne(type => User, user => user.id)
    user: User
        
    @ManyToOne(type => Album, album => album.id, { nullable: true })
    @JoinColumn({ name: 'album' })
    album: Album;
    
    @ManyToOne(type => Artist, artist => artist.id, { nullable: true })
    @JoinColumn({ name: 'artist' })
    artist: Artist;

    @OneToMany(type => RecentlyPlayedTrack, recentlyPlayedTrack => recentlyPlayedTrack.recentlyPlayed)
    @JoinColumn({ name: 'track' })
    recentlyPlayedTracks: RecentlyPlayedTrack[];

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  