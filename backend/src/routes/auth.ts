import { Request, Response, Router } from "express";
import User from "../entities/User";
import { isEmpty, validate } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import auth from "../middleware/auth";

const mapErrors = (errors: Object[]) => {
  //  we can implement this ogic by using 3 different methodologies ie by using forEach,by using map and by using reduce

  // <<<<<<<<<<<<<<by using  forEach>>>>>>>>>>>>

  // let mappedErrors: any = {};
  // errors.forEach((err: any) => {
  //   const key = err.property;
  //   const value = Object.entries(err.constraints)[0][1];
  //   mappedErrors[key] = value;
  // });
  // return mappedErrors;

  //<<<<<<<<<<<<<<by using map>>>>>>>>>>>>>>>>>>>

  // let mappedErrors: any = {};
  // errors.map((err: any) => {
  //   const key = err.property;
  //   const value = Object.entries(err.constraints)[0][1];
  //   mappedErrors[key] = value;
  // });
  // return mappedErrors;

  //<<<<<<<<<<<by usingg reduce>>>>>>>>>>>>

  const reducederrors = errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
  return reducederrors;

  //to see the error prior to transform by above logics

  //return errors;
};
const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};
    const isemailpresent = await User.findOne({ email });
    const isusernamepresent = await User.findOne({ username });
    if (isemailpresent)
      errors.email = "Email is already taken please use new one";
    if (isusernamepresent)
      errors.username = "Username is already taken please use new one";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    const user = new User({ email, username, password });
    errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json(mapErrors(errors));
    }
    await user.save();
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ err });
  }
};

//getusers
const getusers=async(req: Request, res: Response)=>{
const users=await User.find()
res.json(users)
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};
    if (isEmpty(username)) errors.username = "Username must not be empty";
    if (isEmpty(password)) errors.password = "Password must not be empty";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ username: "User not found" });
    const matchpassword = await bcrypt.compare(password, user.password);

    if (!matchpassword)
      return res.status(400).json({ password: "Password is incorrect" });
    const token = jwt.sign({ user }, process.env.JWTSECRET);

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODEENVIRONMENT === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );
    return res.json(user);
  } catch (error) {}
};

const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const logout = async (_: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODEENVIRONMENT === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );
  return res.status(200).json({ success: true });
};
const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/me", auth, me);
router.get("/", getusers);

export default router;
