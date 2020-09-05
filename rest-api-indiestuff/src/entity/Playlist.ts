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
import { User } from "./User";
  
  @Entity()
  export class Playlist {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @Length(2, 150)
    @IsNotEmpty()
    name: string;
  
    @ManyToOne(type => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User
  
    @Column()
    @IsNotEmpty()
    role: string;
  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  