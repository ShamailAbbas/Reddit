import { Request, Response, Router } from "express";
import auth from "../middleware/auth";
import Comment from "../entities/Comment";
import Vote from "../entities/Vote";

import Post from "../entities/Post";

const castvote = async (req: Request, res: Response) => {
  const user = res.locals.user;

  let { value, identifier, slug } = req.body;
  const validvotes = [1, -1, 0];

  value = parseInt(value);
  console.log(typeof value);
  const ifvalidvalue = validvotes.includes(value);

  if (!ifvalidvalue) {
    return res.json({ error: "value must be 1,0 or -1" });
  }

  try {
    // find post on which vote is to be cast
    if (identifier && slug) {
      let post: Post | undefined;
      post = await Post.findOneOrFail({ identifier, slug });
      //if post is found ,find the vote on this post by the current logged in user
      const vote = await Vote.findOne({ username: user.username, post });
      console.log("i am in identifier && slug block");
      //cast new vote if not vote is found
      if (!vote) {
        const newvote = new Vote({ username: user.username, value, post });
        const savedvote = await newvote.save();
        console.log("new vote has been saved");
        console.log(savedvote);
        return res.json({ savedvote });
      }
      //if vote is present but value is different,then change the vote
      if (vote && vote.value !== value) {
        console.log("vote value changed");
        if (vote.value === 1 && value === -1) {
          vote.value = -1;
          const updatevote = await vote.save();
          return res.json({ updatevote: updatevote });
        }
        if (vote.value === -1 && value === 1) {
          console.log("vote value changed");
          vote.value = 1;
          const updatevote = await vote.save();
          return res.json({ updatevote: updatevote });
        }
      }
      if (vote.value === value) {
        return res.json({
          error: "you have already voted with this value on this",
        });
      }
    }

    //find comment on which vote is to be cast
    else {
      let comment: Comment | undefined;
      comment = await Comment.findOneOrFail({ identifier });
      const vote = await Vote.findOne({ comment, username: user.username });
      console.log(vote);
      //cast new vote if not vote is found
      if (!vote) {
        const newvote = new Vote({ username: user.username, value, comment });
        const savedvote = await newvote.save();
        return res.json(savedvote);
      }
      //if vote is present but value is different,then change the vote
      if (vote && vote.value !== value) {
        if (vote.value === 1 && value === -1) {
          vote.value = -1;
          const updatevote = await vote.save();
          return res.json(updatevote);
        }
        if (vote.value === -1 && value === 1) {
          vote.value = 1;
          const updatevote = await vote.save();
          return res.json(updatevote);
        }
      }
      if (vote.value === value) {
        return res.json({
          error: "you have already voted with this value on this",
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ err: err });
  }
};
const getvotes = async (req: Request, res: Response) => {
  const votes = await Vote.find();
  return res.json(votes);
};
const router = Router();
router.post("/", auth, castvote);
router.get("/", getvotes);

export default router;
