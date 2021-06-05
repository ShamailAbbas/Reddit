import { Request, Response, Router } from "express";
import auth from "../middleware/auth";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import { getConnection } from "typeorm";

const createpost = async (req: Request, res: Response) => {
  const { body, title, sub } = req.body;

  const user = res.locals.user;

  if (title.trim() === "")
    return res.status(200).json({ title: "title must not be empty" });

  try {
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const post = new Post({
      title,
      body,
      username: user.username,
      sub: subRecord,
    });
    const savedpost = await post.save();

    return res.json(savedpost);
  } catch (error) {
    console.log("error is >>>");
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const getPosts = async (_: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const posts = await Post.find({
      order: { createdAt: "DESC" },
      relations: ["comment", "vote", "comment.vote"],
    });
    posts.forEach((post) => post.setloggedinuservote(user));
    posts.forEach((post) =>
      post.comment.forEach((comment) => comment.getlogggedinuservote(user))
    );
    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
const getPost = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const { identifier } = req.body;
  try {
    // const post = await Post.find({
    //   select: ["body", "username"],
    //   where: {
    //     identifier,
    //   },

    //   //<<<by using join>>>

    //   join: {
    //     alias: "xxx",
    //     leftJoinAndSelect: {
    //       votesonpost: "xxx.vote",
    //       ipl: "xxx.comment",
    //       commentsvotes: "ipl.vote",
    //     },
    //   },

    //   //<<<<<using relations>>>>>>

    //   relations: ["comment", "vote", "comment.vote"],
    // });

    //<<<<<by using query builder>>>>>>>>>

    const post = await getConnection()
      .getRepository(Post)
      .createQueryBuilder("postsss")
      .where("postsss.identifier=:identifier", { identifier })
      .leftJoinAndSelect("postsss.comment", "commentsss")
      .leftJoinAndSelect("commentsss.vote", "commentsvote")
      .leftJoinAndSelect("postsss.vote", "vote")
      .getOne();

    await post.setloggedinuservote(user);
    console.log(post);
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const router = Router();
router.post("/", auth, createpost);
router.get("/", auth, getPosts);
router.get("/singlepost", auth, getPost);

export default router;
