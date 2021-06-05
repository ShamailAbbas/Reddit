import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
import authroute from "./routes/auth";
import postroute from "./routes/posts";
import subroute from "./routes/subs";
import commentroute from "./routes/comments";
import voteroute from "./routes/votes";
import getusers from "./routes/auth";
import trim from "./middleware/trim";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());

app.get("/", (_, res) => res.send("hello shamail"));
app.use("/api/auth", authroute);
app.use("/api/posts", postroute);
app.use("/api/subs", subroute);
app.use("/api/comments", commentroute);
app.use("/api/votes", voteroute);
app.use("/api/getusers", getusers);

app.listen(process.env.PORT, async () => {
  console.log(`server running at http://localhost:${process.env.PORT}`);

  try {
    await createConnection();
    console.log("database connected....");
  } catch (err) {
    throw err;
  }
});
