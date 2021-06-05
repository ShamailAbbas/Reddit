import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Exclude, Expose } from "class-transformer";

import Entity from "./Entity";
import Post from "./Post";
import Comment from "./Comment";
import User from "./User";

@TOEntity("votes")
export default class Vote extends Entity {
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  username: string;

  @Column()
  value: number;

  @ManyToOne(() => User, (user) => user.vote)
  // @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => Comment)
  comment: Comment;
}
