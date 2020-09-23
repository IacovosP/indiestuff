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
import { CommentInterface } from "@apistuff";
import { User } from "./User";
import { Comment } from "./Comment";
  
  @Entity()
  export class ReplyComment implements CommentInterface {
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

    @ManyToOne(type => Comment, comment => comment.id)
    @JoinColumn({ name: 'comment' })
    parentComment: Comment

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  