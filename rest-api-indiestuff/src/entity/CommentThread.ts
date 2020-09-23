import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany,
    OneToOne
  } from "typeorm";
import { CommentThreadInterface } from "@apistuff";
import { Comment } from "./Comment";
import { Artist } from "./Artist";
import { Album } from "./Album";
import { Track } from "./Track";
  
  @Entity()
  export class CommentThread implements CommentThreadInterface {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    // @OneToMany(type => Comment, comment => comment.commentThread)
    // comments: Comment[];

    @OneToOne(type => Artist, artist => artist.id, { nullable: true })
    @JoinColumn({ name: 'artist' })
    artist: Artist

    @OneToOne(type => Album, album => album.id, { nullable: true })
    @JoinColumn({ name: 'album' })
    album: Album

    @OneToOne(type => Track, track => track.id, { nullable: true })
    @JoinColumn({ name: 'track' })
    track: Track

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  