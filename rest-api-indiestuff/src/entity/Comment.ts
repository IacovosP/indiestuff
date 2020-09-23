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
  import { Length, IsNotEmpty } from "class-validator";
import { CommentThread } from "./CommentThread";
import { CommentInterface } from "@apistuff";
import { User } from "./User";
import { ReplyComment } from "./ReplyComment";
  
  @Entity()
  export class Comment implements CommentInterface{
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column()
    @Length(1, 1000)
    @IsNotEmpty()
    text: string;
  
    @ManyToOne(type => User, user => user.id)
    @JoinColumn({ name: 'user' })
    userId: User;

    @Column()
    @Length(4, 20)
    @IsNotEmpty()
    username: string;

    @ManyToOne(type => CommentThread, commentThread => commentThread.id)
    commentThread: CommentThread

    @OneToMany(type => ReplyComment, replyComment => replyComment.parentComment, { cascade: true })
    replies: ReplyComment[]

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  