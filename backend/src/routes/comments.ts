import { Request, Response, Router } from "express";
import auth from "../middleware/auth";
import Comment from "../entities/Comment";

const createcomment = async (req: Request, res: Response) => {
  const user = res.locals.user;

  const { body, postid } = req.body;

  try {
    const comment = new Comment({ username: user.username, body, postid });
    const savecomment = await comment.save();
    return res.json(savecomment);
  } catch (error) {
    return res.json(error);
  }
};
const getposts = async (_: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const comments = await Comment.find({
      relations: ["user", "post", "vote"],
    });
    comments.forEach((comment) => comment.getlogggedinuservote(user));
    return res.json(comments);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

const router = Router();
router.post("/", auth, createcomment);
router.get("/", auth, getposts);

export default router;
