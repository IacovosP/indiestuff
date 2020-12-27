import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne
  } from "typeorm";
  import { Length, IsNotEmpty, IsEmail } from "class-validator";
import { User } from "./User";
import { ArtistInterface } from "../../types/lib";

  @Entity()
  export class Artist implements ArtistInterface {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column()
    @Length(2, 80)
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @OneToOne(type => User, user => user.id)
    @JoinColumn({ name: 'user' })
    user: User

    @Column({ nullable: true })
    @IsEmail()
    payment_email: string | null;
    
    @Column({ nullable: true })
    artist_image_filename: string | null;
    
    @Column({ nullable: true })
    artist_top_image_filename: string | null;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  }
  