import {
  Entity as TOEntity,
  Column,
  ManyToOne,
  JoinColumn,  
  BeforeInsert,
  OneToMany,
  AfterLoad,
} from "typeorm";
import { makeId } from "../utils/helpers";
import Entity from "./Entity";
import Post from "./Post";
import User from "./User";
import Vote from "./Vote";

@TOEntity("comments")
export default class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Column()
  identifier: string;

  @Column()
  postid: string;

  @Column({ nullable: false, type: "text" })
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post)
  @JoinColumn({ name: "postid", referencedColumnName: "identifier" })
  post: Post;

  @OneToMany(() => Vote, (vote) => vote.comment)
  vote: Vote[];

  protected loggedinuservote: number;
  getlogggedinuservote(user) {
    const vote = this.vote?.filter((vote) => vote.username === user.username);

    if (vote.length > 0) {
      this.loggedinuservote = vote[0].value;
    }
  }
  protected votesum: number;
  @AfterLoad()
  getvotescore() {
    this.votesum = this.vote?.reduce(
      (prev, current) => prev + (current.value || 0),
      0
    );
  }

  @BeforeInsert()
  makeidforcomment() {
    this.identifier = makeId(7);
  }
}
