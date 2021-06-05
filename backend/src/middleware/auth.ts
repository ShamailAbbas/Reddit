import { NextFunction, Request, Response } from "express";
import User from "../entities/User";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("You are not authanticated");

    const { user }: any = jwt.verify(token, process.env.JWTSECRET);

    const UserExists = await User.findOne({ username: user.username });
    if (!UserExists) {
      throw new Error("You are not authanticated");
    }

    res.locals.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
