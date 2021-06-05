import { IsEmail, MinLength } from "class-validator";
import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
  OneToOne,
} from "typeorm";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

import Entity from "./Entity";
import Post from "./Post";
import Comment from "./Comment";
import Vote from "./Vote";

@TOEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @IsEmail(undefined, { message: "Must be a valid email address" })
  @MinLength(1, { message: "Email must not be empty" })
  @Column({ unique: true })
  email: string;

  @Index()
  @MinLength(3, { message: "Must be aleast 3 characters long" })
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  @MinLength(6, { message: "Must be atleast 6 characters long" })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  user: Comment[];

  @OneToOne(() => Vote, (vote) => vote.user)
  vote: Vote[];

  @BeforeInsert()
  async hashpassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
