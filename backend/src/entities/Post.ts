import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  AfterLoad,
  OneToMany,
  OneToOne,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import { makeId, slugify } from "../utils/helpers";
import Sub from "./Sub";
import { Expose } from "class-transformer";
import Comment from "./Comment";
import Vote from "./Vote";

@TOEntity("posts")
export default class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Column({ unique: true })
  identifier: string;

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column()
  subName: string;

  @Column()
  username: string;

  //if we don't add the above 2 @Column(), the response will not have this field although the below code adds these column in the database

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];

  @OneToMany(() => Vote, (vote) => vote.post)
  vote: Vote[];

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }
  @Expose() get totalcomments(): number {
    if (this.comment) return this.comment?.length;
    else return 0;
  }
  @Expose() get votescore(): number {
    return this.vote?.reduce((prev, current) => prev + (current.value || 0), 0);
  }

  protected loggedinuservote: number;
  setloggedinuservote(user) {
    const vote = this.vote.filter((vote) => vote.username === user.username);
    if (vote.length > 0) {
      this.loggedinuservote = vote[0].value;
    }
  }

  @BeforeInsert()
  makeidandslugfy() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
