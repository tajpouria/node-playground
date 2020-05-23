import express from "express";
import crypto from "crypto";
import { readFile } from "fs";
import util from "util";

import { User, IUser } from "../models/user";

const sessionRouter = express.Router();

sessionRouter.get("/", (_, res) => {
  res.sendFile(`${process.cwd()}/src/static/session.html`);
});

sessionRouter.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) return res.status(400);

    const token = crypto.randomBytes(64).toString("hex");

    const existingUser = (await User.findOne({ username })) as IUser | null;

    if (existingUser) {
      if (!existingUser.comparePasswords(password))
        return res.status(400).send({ ok: false });
      await User.updateOne({ username }, { $set: { token } });
    } else {
      const newUser = new User({ username, password, role, token });
      await newUser.save();
    }

    res.setHeader("Set-Cookie", [
      `token=${token}; HttpOnly; SameSite=Lax; Path=/`,
    ]);
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

sessionRouter.get("/lobby", async (req, res) => {
  try {
    const token = req.cookies?.token;
    const user = (await User.findOne({
      token: token,
    })) as IUser | null;

    if (!token || !user) return res.status(401).send("<h1>UnAuthorized</h1>");

    const html = (
      await util.promisify(readFile)(
        `${process.cwd()}/src/static/lobby.html`,
        "UTF8",
      )
    )
      .replace("%USER%", user.username)
      .replace("%ROLE%", user.role);

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

sessionRouter.get("/logout", async (req, res) => {
  try {
    const token = req.cookies?.token;
    await User.updateOne({ token }, { $set: { token: null } });

    res.setHeader("Set-Cookie", [`token=1234; Expires=${Date.now()}`]);
    res.status(204).redirect("/session");
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

export { sessionRouter };
